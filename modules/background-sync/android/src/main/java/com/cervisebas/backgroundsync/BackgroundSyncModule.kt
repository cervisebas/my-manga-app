package com.cervisebas.backgroundsync

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BackgroundSyncModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("BackgroundSync")

    Function("start") {
      val context =
        appContext.reactContext ?: return@Function false

      AlarmScheduler.schedule(context)
    }
  }
}
