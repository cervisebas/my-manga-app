package com.cervisebas.insecurefetch

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import java.security.cert.X509Certificate
import javax.net.ssl.*
import android.util.Base64

class ExpoInsecureFetchModule : Module() {
  
  override fun definition() = ModuleDefinition {
    
    Name("ExpoInsecureFetch")

    AsyncFunction("fetch") { 
      url: String, method: String, headers: Map<String, String>?, body: String? ->

      // Configurar SSL para confiar en todos los certificados
      val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
        override fun checkClientTrusted(chain: Array<X509Certificate>?, authType: String?) {}
        override fun checkServerTrusted(chain: Array<X509Certificate>?, authType: String?) {}
        override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
      })
      val sslContext = SSLContext.getInstance("SSL").apply {
        init(null, trustAllCerts, java.security.SecureRandom())
      }
      val client = OkHttpClient.Builder()
        .sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
        .hostnameVerifier { _, _ -> true }
        .build()

      // Construir solicitud
      val builder = Request.Builder().url(url)
      headers?.forEach { (k, v) -> builder.addHeader(k, v) }
      val mt = "application/json".toMediaTypeOrNull()
      val rb = body?.let { RequestBody.create(mt, it) }

      when (method.uppercase()) {
        "GET" -> builder.get()
        "POST" -> builder.post(rb ?: RequestBody.create(mt, ByteArray(0)))
        "PUT" -> builder.put(rb ?: RequestBody.create(mt, ByteArray(0)))
        "DELETE" -> if (rb != null) builder.delete(rb) else builder.delete()
        else -> throw Exception("Método HTTP no soportado: $method")
      }

      val req = builder.build()
      val resp = client.newCall(req).execute()

      val code = resp.code
      val bodyBytes = resp.body?.bytes() ?: ByteArray(0)
      val hdrs = resp.headers.toMultimap()

      if (!resp.isSuccessful) {
        val msg = bodyBytes.toString(Charsets.UTF_8)
        throw Exception("HTTP $code: $msg")
      }

      mapOf(
        "status" to code,
        "headers" to hdrs,
        "body" to Base64.encodeToString(bodyBytes, Base64.NO_WRAP)
      )
    }
    
  }
}
