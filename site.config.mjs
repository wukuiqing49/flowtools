export const site = {
  name: "FlowTools",
  alternateName: "上海促动科技有限公司",
  domain: "https://flowtools.app",
  email: "wukuiqing@gmail.com",
  developer: "AndroidManTou",
  company: {
    en: "Shanghai Cudong Technology Co., Ltd.",
    zh: "上海促动科技有限公司"
  }
};

export const products = [
  {
    slug: "captionmeta",
    schemaCategory: "PhotographyApplication",
    name: "CaptionMeta",
    storeName: "CaptionMeta: IPTC Metadata",
    packageName: "com.wkq.caption",
    icon: "/assets/apps/captionmeta/icon.png",
    screenshots: [
      "/assets/apps/captionmeta/screen-1.webp",
      "/assets/apps/captionmeta/screen-2.webp",
      "/assets/apps/captionmeta/screen-3.webp"
    ],
    en: {
      category: "Photo metadata",
      tagline: "Professional photo metadata, from capture to delivery.",
      description: "Edit IPTC, EXIF and XMP metadata on Android. Add captions, keywords and essential photo information without breaking your field workflow.",
      tags: ["IPTC", "EXIF", "XMP", "Photography"],
      features: [
        ["Metadata-first capture", "Capture and tag photos with reusable metadata presets."],
        ["Batch IPTC editing", "Apply captions, keywords and ownership information efficiently."],
        ["Professional standards", "Work with IPTC, EXIF and XMP metadata in one focused app."],
        ["Delivery workflow", "Prepare organized photo information before upload or archive."]
      ],
      faq: [
        ["What metadata does CaptionMeta support?", "CaptionMeta is designed for IPTC, EXIF and XMP workflows, including captions, keywords and photo information."],
        ["Is it suitable for field photography?", "Yes. Capture, presets and batch editing are designed to reduce repetitive metadata work away from the desk."],
        ["Where can I install CaptionMeta?", "CaptionMeta is available for Android through Google Play."]
      ]
    },
    zh: {
      category: "照片元数据",
      tagline: "从拍摄到交付，专业管理照片元数据。",
      description: "在 Android 上编辑 IPTC、EXIF 与 XMP 元数据，为照片添加说明、关键词和必要信息，让现场工作流保持高效。",
      tags: ["IPTC", "EXIF", "XMP", "摄影"],
      features: [
        ["元数据优先拍摄", "使用可复用的元数据预设拍摄并标记照片。"],
        ["批量编辑 IPTC", "高效添加说明、关键词和版权信息。"],
        ["专业标准", "在一个专注的应用中管理 IPTC、EXIF 与 XMP。"],
        ["交付工作流", "在上传或归档前整理好照片信息。"]
      ],
      faq: [
        ["CaptionMeta 支持哪些元数据？", "CaptionMeta 面向 IPTC、EXIF 和 XMP 工作流，包括说明、关键词与照片信息。"],
        ["适合现场摄影吗？", "适合。拍摄、预设与批量编辑功能可以减少离开电脑时的重复工作。"],
        ["在哪里安装 CaptionMeta？", "CaptionMeta 已通过 Google Play 提供 Android 版本。"]
      ]
    }
  },
  {
    slug: "cloud-music",
    schemaCategory: "MusicApplication",
    name: "Cloud Music",
    storeName: "Cloud Music",
    packageName: "com.wkq.cloudmusic",
    icon: "/assets/apps/cloud-music/icon.png",
    screenshots: [
      "/assets/apps/cloud-music/screen-1.webp",
      "/assets/apps/cloud-music/screen-2.webp"
    ],
    en: {
      category: "Music player",
      tagline: "Cloud and local music in one focused player.",
      description: "A clean Android music player for browsing cloud music, local tracks, artists and playlists from one practical library.",
      tags: ["Cloud music", "Local library", "Playlists", "Android"],
      features: [
        ["Cloud music", "Open your cloud music library from a dedicated source."],
        ["Local playback", "Browse and play music already stored on your device."],
        ["Organized library", "Move between artists, playlists and music sources quickly."],
        ["Local scanning", "Scan the device to bring compatible tracks into your library."]
      ],
      faq: [
        ["Can Cloud Music play local files?", "Yes. The app includes a local music library and device scanning workflow."],
        ["Does it organize artists and playlists?", "Yes. Artists and playlists are available as dedicated library views."],
        ["Where can I install Cloud Music?", "Cloud Music is available for Android through Google Play."]
      ]
    },
    zh: {
      category: "音乐播放器",
      tagline: "一个播放器，管理云端与本地音乐。",
      description: "简洁实用的 Android 音乐播放器，可在同一个音乐库中浏览云盘音乐、本地歌曲、艺术家与歌单。",
      tags: ["云盘音乐", "本地音乐", "歌单", "Android"],
      features: [
        ["云盘音乐", "通过独立入口访问你的云端音乐库。"],
        ["本地播放", "浏览并播放设备上已有的音乐文件。"],
        ["清晰的音乐库", "在艺术家、歌单与不同音乐来源之间快速切换。"],
        ["扫描本地音乐", "扫描设备并将兼容的歌曲加入音乐库。"]
      ],
      faq: [
        ["Cloud Music 可以播放本地文件吗？", "可以，应用提供本地音乐库和设备扫描入口。"],
        ["可以管理艺术家和歌单吗？", "可以，艺术家与歌单都有独立的音乐库视图。"],
        ["在哪里安装 Cloud Music？", "Cloud Music 已通过 Google Play 提供 Android 版本。"]
      ]
    }
  },
  {
    slug: "geolens",
    schemaCategory: "PhotographyApplication",
    name: "GeoLens",
    storeName: "GeoLens: Photo Workflow",
    packageName: "com.wkq.field",
    icon: "/assets/apps/geolens/icon.png",
    screenshots: [
      "/assets/apps/geolens/screen-1.webp",
      "/assets/apps/geolens/screen-2.webp",
      "/assets/apps/geolens/screen-3.webp"
    ],
    en: {
      category: "Field photography",
      tagline: "Capture field photos with the context intact.",
      description: "Capture, tag and deliver photos with embedded location, metadata and direct server uploads for traceable field media workflows.",
      tags: ["Field camera", "GPS", "Metadata", "Upload"],
      features: [
        ["Metadata-first capture", "Prepare location and job metadata before the workspace opens."],
        ["Location context", "Attach relevant GPS context to field images when the feature is enabled."],
        ["Consistent tagging", "Use structured information to keep field photo sets understandable."],
        ["Direct delivery", "Send prepared media to a configured server workflow."]
      ],
      faq: [
        ["What is GeoLens designed for?", "GeoLens is designed for industrial and professional field photography where location and metadata matter."],
        ["Can it include location information?", "Yes. Location can be included when you enable the relevant Android permission and workflow."],
        ["Where can I install GeoLens?", "GeoLens is available for Android through Google Play."]
      ]
    },
    zh: {
      category: "现场摄影",
      tagline: "拍摄现场照片，同时保留完整上下文。",
      description: "在现场完成拍摄、标记与交付，为照片加入位置和元数据，并支持直接上传到服务器工作流。",
      tags: ["现场相机", "GPS", "元数据", "上传"],
      features: [
        ["元数据优先拍摄", "在进入拍摄工作区前准备位置和任务信息。"],
        ["位置上下文", "启用相应权限后，为现场照片附加相关 GPS 信息。"],
        ["一致的标记方式", "通过结构化信息让现场照片集更易理解。"],
        ["直接交付", "将准备好的媒体发送到已配置的服务器工作流。"]
      ],
      faq: [
        ["GeoLens 适合什么场景？", "GeoLens 面向重视位置与元数据的工业和专业现场摄影。"],
        ["可以记录位置信息吗？", "可以，在启用对应 Android 权限和功能后可加入位置信息。"],
        ["在哪里安装 GeoLens？", "GeoLens 已通过 Google Play 提供 Android 版本。"]
      ]
    }
  },
  {
    slug: "pixora",
    schemaCategory: "PhotographyApplication",
    name: "Pixora",
    storeName: "Pixora - Offline Photo AI",
    packageName: "com.wkq.aisearch.gallery.offline.ocr",
    icon: "/assets/apps/pixora/icon.png",
    screenshots: [
      "/assets/apps/pixora/screen-1.webp",
      "/assets/apps/pixora/screen-2.webp",
      "/assets/apps/pixora/screen-3.webp"
    ],
    en: {
      category: "Offline photo AI",
      tagline: "Find and process photos with private, offline AI.",
      description: "Search and process your photo library with on-device AI. Find similar images and use practical photo tools without a subscription.",
      tags: ["Offline AI", "Photo search", "Similar photos", "Privacy"],
      features: [
        ["Offline AI search", "Search your photo library with processing designed to stay on the device."],
        ["Similar photo finder", "Compare visual features to surface related images."],
        ["Privacy tools", "Use traceable removal and practical local photo utilities."],
        ["Creative processing", "Access enhancement, watermark and conversion workflows in one toolbox."]
      ],
      faq: [
        ["Does Pixora require a subscription?", "The current Google Play listing describes Pixora as available without a subscription."],
        ["Does AI processing work offline?", "Pixora is built around offline, on-device photo search and processing workflows."],
        ["Where can I install Pixora?", "Pixora is available for Android through Google Play."]
      ]
    },
    zh: {
      category: "离线照片 AI",
      tagline: "使用私密的离线 AI 查找和处理照片。",
      description: "通过端侧 AI 搜索和处理照片库，查找相似图片并使用实用照片工具，无需订阅。",
      tags: ["离线 AI", "照片搜索", "相似照片", "隐私"],
      features: [
        ["离线 AI 搜索", "通过尽可能留在设备端的处理方式搜索照片库。"],
        ["相似照片查找", "比较视觉特征，快速找到相关图片。"],
        ["隐私工具", "使用可追踪移除等实用的本地照片工具。"],
        ["创意处理", "在一个工具箱中使用增强、水印和格式转换功能。"]
      ],
      faq: [
        ["Pixora 需要订阅吗？", "当前 Google Play 商店说明中，Pixora 无需订阅。"],
        ["AI 处理可以离线运行吗？", "Pixora 的核心是离线、端侧的照片搜索和处理工作流。"],
        ["在哪里安装 Pixora？", "Pixora 已通过 Google Play 提供 Android 版本。"]
      ]
    }
  },
  {
    slug: "sitereport",
    schemaCategory: "BusinessApplication",
    featured: true,
    name: "SiteReport",
    storeName: "SiteReport: Inspection App",
    packageName: "com.wkq.site",
    icon: "/assets/apps/sitereport/icon.png",
    screenshots: [
      "/assets/apps/sitereport/screen-1.webp",
      "/assets/apps/sitereport/screen-2.webp",
      "/assets/apps/sitereport/screen-3.webp"
    ],
    en: {
      category: "Site inspection",
      tagline: "Turn field inspections into reports that are ready to share.",
      description: "Run inspection checklists, capture photo evidence and GPS context, then create PDF reports for professional site audits.",
      tags: ["Inspections", "Checklists", "GPS", "PDF reports"],
      features: [
        ["Inspection checklists", "Keep repeatable site checks organized and easy to follow."],
        ["Photo evidence", "Capture visual evidence alongside the inspection record."],
        ["Location context", "Include relevant GPS details when location access is enabled."],
        ["Shareable reports", "Generate and share PDF reports after the inspection is complete."]
      ],
      faq: [
        ["Can SiteReport work in the field?", "Yes. It is designed for practical inspection workflows, including work where connectivity may be limited."],
        ["What can I include in a report?", "Workflows can include checklists, photos, GPS context and generated PDF reports."],
        ["Where can I install SiteReport?", "SiteReport is available for Android through Google Play."]
      ]
    },
    zh: {
      category: "现场检查",
      tagline: "把现场检查转化为可直接分享的专业报告。",
      description: "执行检查清单、记录照片证据与 GPS 上下文，并为专业现场审核生成 PDF 报告。",
      tags: ["现场检查", "检查清单", "GPS", "PDF 报告"],
      features: [
        ["检查清单", "让可重复的现场检查保持清晰、有序。"],
        ["照片证据", "在检查记录中同步保存现场照片证据。"],
        ["位置上下文", "启用位置权限后，可加入相关 GPS 信息。"],
        ["可分享报告", "检查完成后生成并分享 PDF 报告。"]
      ],
      faq: [
        ["SiteReport 适合现场使用吗？", "适合。它面向实际检查工作流，也考虑了网络连接受限的场景。"],
        ["报告可以包含什么？", "工作流可以包含检查清单、照片、GPS 上下文和生成的 PDF 报告。"],
        ["在哪里安装 SiteReport？", "SiteReport 已通过 Google Play 提供 Android 版本。"]
      ]
    }
  }
];

export function storeUrl(product, language = "en") {
  const hl = language === "zh" ? "zh-CN" : "en";
  return `https://play.google.com/store/apps/details?id=${product.packageName}&hl=${hl}`;
}
