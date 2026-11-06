---
name: capacitor-offline-gis-lifecycle
description: >-
  Configure and harden Capacitor Android containers for offline field mapping, GPS logging, and zero-signal environments.
  Use when setting up mobile storage persistence (preventing OS cache purging), managing background vs foreground GNSS hardware battery drain,
  writing direct GIS exports to Android Scoped Storage (Documents/), and attaching files to native Android Share intents.
---

# Capacitor Android Offline GIS & Hardware Lifecycle

This skill provides the architectural guidelines to harden Capacitor 6+ hybrid Android apps for long-duration outdoor fieldwork with zero cellular connectivity.

---

## 1. Quick Environment Audit (Run as Black Box)

Before building or debugging Capacitor Android projects, audit the configuration using the bundled CLI utility:

```bash
# View available options
node scripts/check_capacitor_env.cjs --help

# Audit AndroidManifest and permissions
node scripts/check_capacitor_env.cjs "./app" --json
```

The script verifies:
- `android:largeHeap="true"` to prevent Out-Of-Memory kills when loading large maps.
- `android:hardwareAccelerated="true"` for smooth 60fps pan/zoom.
- `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, and `CAMERA` permissions.

---

## 2. Decision Tree: Power & Storage Governance

```mermaid
flowchart TD
    A[App Lifecycle / Action] --> B{What event occurred?}
    
    B -- App Sent to Background --> C{Is a GPS Track Logging Active?}
    C -- Yes --> D[Keep Hardware Watcher Active:<br/>Continue logging points every 2s / 5m]
    C -- No --> E[Power Down GNSS Watcher:<br/>Call stopWatching() to prevent battery drain]

    B -- App Returns to Foreground --> F[Resume GNSS Watcher:<br/>Call startWatching() immediately]

    B -- App Startup --> G[Request Storage Persistence:<br/>navigator.storage.persist() to prevent OS purging]

    B -- Export File Action --> H{User Action}
    H -- Save to Storage --> I[Write directly to Documents/AppName/<br/>via @capacitor/filesystem Directory.Documents]
    H -- Share Intent --> J[Omit 'text' parameter in Share.share():<br/>Forces OS to treat payload strictly as EXTRA_STREAM file attachment]
```

---

## 3. Storage Persistence Rule (Air-Gap Protection)

In Android WebView, IndexedDB data can be purged by the OS during low-disk-space maintenance. For zero-cloud offline field apps, call this during application initialization:

```typescript
export async function ensurePersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      return await navigator.storage.persist();
    }
    return isPersisted;
  }
  return false;
}
```

---

## 4. Scoped Storage Write Recipe (Android 11–14+)

To save survey files directly where the surveyor can access them using the native Android Files app:

```typescript
import { Filesystem, Directory } from '@capacitor/filesystem';

export async function saveToDeviceDocuments(subfolder: string, fileName: string, base64Data: string): Promise<string> {
  const dirPath = subfolder;
  // Create application folder under Documents/
  try {
    await Filesystem.mkdir({
      path: dirPath,
      directory: Directory.Documents,
      recursive: true,
    });
  } catch (e) {
    // Ignore if directory already exists
  }

  const filePath = `${dirPath}/${fileName}`;
  await Filesystem.writeFile({
    path: filePath,
    data: base64Data,
    directory: Directory.Documents,
  });

  return `Documents/${filePath}`;
}
```

---

## 5. Native Share Intent Attachment Recipe

When sharing files via Android's Share Sheet (`@capacitor/share`), **never pass the `text` parameter** if you want messaging apps (e.g. WhatsApp, Gmail) to treat the payload strictly as a file document attachment:

```typescript
import { Share } from '@capacitor/share';

// CORRECT: Treated strictly as file attachment (EXTRA_STREAM)
await Share.share({
  title: 'Export Survey Data',
  url: fileUri,
  dialogTitle: 'Share GIS File via Bluetooth, Drive, or WhatsApp',
});

// WRONG: WhatsApp and other apps will post the text and discard the attachment!
// await Share.share({ title, text: 'Here is your file', url: fileUri });
```

