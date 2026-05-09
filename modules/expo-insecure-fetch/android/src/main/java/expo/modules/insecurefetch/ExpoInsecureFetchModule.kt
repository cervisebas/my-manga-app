package com.cervisebas.insecurefetch

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.util.Base64

import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response

import java.io.File
import java.io.FileOutputStream

import java.security.cert.X509Certificate

import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

class ExpoInsecureFetchModule : Module() {
  private fun createHttpClient(): OkHttpClient {
    val trustAllCerts = arrayOf<TrustManager>(
      object : X509TrustManager {
        override fun checkClientTrusted(
          chain: Array<X509Certificate>?,
          authType: String?
        ) {}

        override fun checkServerTrusted(
          chain: Array<X509Certificate>?,
          authType: String?
        ) {}

        override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
      }
    )

    val sslContext = SSLContext.getInstance("SSL").apply {
      init(null, trustAllCerts, java.security.SecureRandom())
    }

    return OkHttpClient.Builder()
      .sslSocketFactory(
        sslContext.socketFactory,
        trustAllCerts[0] as X509TrustManager
      )
      .hostnameVerifier { _, _ -> true }
      .build()
  }

  private fun executeRequest(
    url: String,
    method: String,
    headers: Map<String, String>?,
    body: String?
  ): Response {

    val client = createHttpClient()

    // URL
    val builder = Request.Builder()
      .url(url)

      // Headers
    headers?.forEach { (k, v) ->
      builder.addHeader(k, v)
    }

    // Body
    val mediaType = "application/json".toMediaTypeOrNull()
    val requestBody = body?.toRequestBody(mediaType)


    // Method
    when (method.uppercase()) {
      "GET" -> builder.get()

      "POST" -> builder.post(
        requestBody ?: ByteArray(0).toRequestBody(mediaType)
      )

      "PUT" -> builder.put(
        requestBody ?: ByteArray(0).toRequestBody(mediaType)
      )

      "DELETE" -> {
        if (requestBody != null) {
          builder.delete(requestBody)
        } else {
          builder.delete()
        }
      }

      else -> {
        throw Exception("Método HTTP no soportado: $method")
      }
    }

    // Build Request
    val request = builder.build()
    
    // Response
    val response = client.newCall(request).execute()

    if (!response.isSuccessful) {
      val msg = response.body?.string() ?: ""
      throw Exception("HTTP ${response.code}: $msg")
    }

    return response
  }
  
  override fun definition() = ModuleDefinition {
    
    Name("ExpoInsecureFetch")


    AsyncFunction("downloadFile") {
      url: String,
      method: String,
      headers: Map<String, String>?,
      body: String?,
      outputPath: String ->

      val response = executeRequest(
        url,
        method,
        headers,
        body
      )

      val responseBody = response.body
        ?: throw Exception("Respuesta vacía")

      val file = File(outputPath)

      file.parentFile?.mkdirs()

      responseBody.byteStream().use { input ->
        FileOutputStream(file).use { output ->
          input.copyTo(output)
        }
      }

      mapOf(
        "status" to response.code,
        "headers" to response.headers.toMultimap(),
        "path" to file.absolutePath,
        "size" to file.length()
      )
    }

    AsyncFunction("fetch") {
      url: String,
      method: String,
      headers: Map<String, String>?,
      body: String? ->

      val response = executeRequest(
        url,
        method,
        headers,
        body
      )

      val bodyBytes = response.body?.bytes() ?: ByteArray(0)

      mapOf(
        "status" to response.code,
        "headers" to response.headers.toMultimap(),
        "body" to Base64.encodeToString(
          bodyBytes,
          Base64.NO_WRAP
        )
      )
    }
  }
}
