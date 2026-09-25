// Complete realistic alert dataset for Mumbai Metropolitan Municipal Flood Response
export const INITIAL_ALERTS = [
  {
    id: 'alt-101',
    severity: 'critical',
    hazardCategory: 'cloudburst', // 'cloudburst' | 'high-tide' | 'subway' | 'drain-breach' | 'railway' | 'manhole'
    title: 'CRITICAL FLASH FLOOD WARNING: Hindmata & King’s Circle',
    ward: 'F-North',
    wardName: 'Ward F-North — Sion & Matunga / Hindmata',
    coordinates: { lat: 19.0250, lng: 72.8520 },
    issuedAt: '8 mins ago',
    timestamp: Date.now() - 8 * 60 * 1000,
    validUntil: 'T+90 min (22:45 IST)',
    waterDepth: 38,
    waterDepthTrend: '+4 cm / 10m',
    rainfallRate: 68, // mm/h
    vehicleMaxClearance: 20, // cm - sedans stall above this
    sensorId: 'ULTRASONIC-HM-02',
    cctvCameraId: 'CCTV-FN-104',
    message: 'Intense cloudburst cell directly over Gandhi Market low basin. Water ingress reaching knee level. Western & Central railway lines cautioned at Matunga.',
    directives: [
      'Do NOT attempt to cross Gandhi Market subway under any circumstance',
      'Pedestrians avoid sidewalk edges — 2 dislodged manholes flagged on Dr. Ambedkar Road',
      'Relocate ground floor appliances and business inventory to mezzanine levels',
      'Switch off ground-floor main electrical MCB breakers to avoid electrocution hazard'
    ],
    soundAlert: 'Critical Flash Flood Alert in Hindmata. Water depth 38 centimeters and rising. Avoid Gandhi Market subway immediately.',
    acknowledged: false,
    acknowledgedAt: null,
    userCheckedDirectives: {},
    crowdsourced: {
      risingVotes: 89,
      recedingVotes: 4,
      blockedReports: 62,
      rescueRequests: 5,
      lastReportedMinsAgo: 2
    },
    telemetry: [
      { time: '19:30', depth: 8, rain: 22 },
      { time: '19:50', depth: 16, rain: 42 },
      { time: '20:10', depth: 27, rain: 58 },
      { time: '20:30', depth: 38, rain: 68 },
      { time: '20:50 (Forecast)', depth: 44, rain: 60, isForecast: true },
      { time: '21:15 (Forecast)', depth: 32, rain: 28, isForecast: true }
    ],
    shelterRecommendation: {
      name: 'King George High School & Community Center',
      distance: '650m',
      elevation: '+14m MSL',
      capacity: '320 beds available',
      address: 'Hindu Colony, Dadar East (High Datum)',
      shelterId: 'safe-01'
    },
    emergencyContacts: {
      wardControlDesk: '022-24024355',
      wardOfficer: 'Mr. S. Kulkarni (9820144512)',
      fireStation: 'Dadar Fire Brigade (101 / 022-24304141)',
      ndrfBattalion: 'NDRF Unit 5 Camp Sion (9423578910)'
    },
    translations: {
      mr: {
        title: 'अति-गंभीर पूर इशारा: हिंदमाता आणि किंग्स सर्कल',
        message: 'गांधी मार्केट आणि हिंदमाता सखल भागात ढगफुटीसदृश पाऊस. गुडघ्यापर्यंत पाणी साचले आहे. मध्य रेल्वेची माटुंगा येथील वाहतूक मंदावली.',
        soundAlert: 'हिंदमाता भागात अति-गंभीर पूर इशारा. ३८ सेमी पाणी साचले आहे. गांधी मार्केट सबवे ताबडतोब टाळा.',
        directives: [
          'कोणत्याही परिस्थितीत गांधी मार्केट सबवे पार करण्याचा प्रयत्न करू नका',
          'पादचाऱ्यांनी रस्त्याच्या कडेला जाणे टाळावे — डॉ. आंबेडकर रोडवर उघडी मॅनहोल्स आढळली आहेत',
          'तळमजल्यावरील वीज उपकरणे आणि सामान वरच्या मजल्यावर हलवा',
          'शॉर्ट सर्किट टाळण्यासाठी तळमजल्याचे वीज मेन स्विच बंद करा'
        ]
      },
      hi: {
        title: 'अत्यंत गंभीर बाढ़ चेतावनी: हिंदमाता और किंग्स सर्कल',
        message: 'गांधी मार्केट और हिंदमाता निचले इलाके में मूसलाधार बारिश। पानी घुटनों तक पहुंचा। माटुंगा के पास मध्य रेलवे यातायात सतर्क।',
        soundAlert: 'हिंदमाता में गंभीर फ्लैश फ्लड चेतावनी। जल स्तर ३८ सेमी। गांधी मार्केट सबवे से तुरंत दूर रहें।',
        directives: [
          'किसी भी परिस्थिति में गांधी मार्केट सबवे पार करने की कोशिश न करें',
          'पैदल चलने वाले फुटपाथ के किनारों से बचें — डॉ. आंबेडकर मार्ग पर २ खुले मैनहोल दर्ज किए गए',
          'भूतल के घरेलू उपकरण और माल मेज़ानाइन स्तर पर स्थानांतरित करें',
          'बिजली के झटके से बचने के लिए ग्राउंड फ्लोर मेन एमसीबी बंद करें'
        ]
      }
    }
  },
  {
    id: 'alt-102',
    severity: 'danger',
    hazardCategory: 'high-tide',
    title: 'HIGH TIDE + INTENSE RUNOFF CONFLUENCE: Mithi River / BKC',
    ward: 'H-East',
    wardName: 'Ward H-East — Bandra East & Kalina Outfall',
    coordinates: { lat: 19.0650, lng: 72.8680 },
    issuedAt: '18 mins ago',
    timestamp: Date.now() - 18 * 60 * 1000,
    validUntil: 'T+120 min (23:15 IST)',
    waterDepth: 28,
    waterDepthTrend: '+2 cm / 10m',
    rainfallRate: 54,
    vehicleMaxClearance: 25,
    sensorId: 'RADAR-MITHI-04',
    cctvCameraId: 'CCTV-HE-089',
    message: '4.42m Arabian Sea astronomical high tide coinciding with 64 mm/h cloudburst runoff in upper Mithi catchment. Drainage sluice gates locked to prevent sea backflow.',
    directives: [
      'BKC Connector to Chunabhatti remains OPEN, dry, and recommended',
      'Avoid ground-level basement car parking at BKC G-Block and Diamond Bourse',
      'Kalanagar junction underpass lane 1 experiencing 28cm waterlogging',
      'Heavy trucks restricted from entering Vakola nallah approach lanes'
    ],
    soundAlert: 'High tide confluence warning for Mithi River and BKC. Elevated connector is clear and safe.',
    acknowledged: false,
    acknowledgedAt: null,
    userCheckedDirectives: {},
    crowdsourced: {
      risingVotes: 51,
      recedingVotes: 12,
      blockedReports: 28,
      rescueRequests: 1,
      lastReportedMinsAgo: 5
    },
    telemetry: [
      { time: '19:30', depth: 6, rain: 18 },
      { time: '19:50', depth: 14, rain: 35 },
      { time: '20:10', depth: 22, rain: 48 },
      { time: '20:30', depth: 28, rain: 54 },
      { time: '20:50 (Forecast)', depth: 33, rain: 45, isForecast: true },
      { time: '21:15 (Forecast)', depth: 24, rain: 20, isForecast: true }
    ],
    shelterRecommendation: {
      name: 'Bandra Kurla Complex Multi-Level Relief Center',
      distance: '820m',
      elevation: '+18m MSL',
      capacity: '450 spaces',
      address: 'BKC E-Block Central Concourse',
      shelterId: 'safe-02'
    },
    emergencyContacts: {
      wardControlDesk: '022-26591000',
      wardOfficer: 'Ms. P. Deshmukh (9820556781)',
      fireStation: 'BKC Fire Sub-Station (022-26500101)',
      ndrfBattalion: 'MMRDA Disaster Rapid Response (1800-22-1916)'
    },
    translations: {
      mr: {
        title: 'भरती आणि अतिवृष्टी संगम इशारा: मिठी नदी / बीकेसी',
        message: 'अरबी समुद्रातील ४.४२ मीटरची मोठी भरती आणि मिठी नदी पाणलोटातील मुसळधार पाऊस एकत्र आल्याने पाण्याचा फुगवटा. समुद्राचे पाणी आत शिरू नये म्हणून फ्लॅप गेट्स बंद.',
        soundAlert: 'मिठी नदी आणि बीकेसी भागात भरतीचा धोका. बीकेसी कनेक्टर पूल वाहतुकीसाठी सुरक्षित आहे.',
        directives: [
          'बीकेसी ते चुनाभट्टी कनेक्टर पूर्णपणे सुरू असून प्रवासासाठी सुरक्षित आहे',
          'बीकेसी जी-ब्लॉक आणि डायमंड बोर्सच्या तळघरातील पार्किंग टाळा',
          'कलानगर जंक्शन सबवे लेन १ मध्ये २८ सेमी पाणी साचले आहे',
          'जड वाहनांना वाकोला नाला मार्गावर प्रवेश बंदी'
        ]
      },
      hi: {
        title: 'उच्च ज्वार और भारी बहाव संगम चेतावनी: मीठी नदी / बीकेसी',
        message: 'अरबी समुद्र में ४.४२ मीटर का हाई टाइड और मीठी नदी में भारी वर्षा का पानी एक साथ। समुद्री पानी पीछे न आए इसलिए जल निकासी गेट बंद।',
        soundAlert: 'मीठी नदी और बीकेसी के लिए हाई टाइड संगम चेतावनी। एलिवेटेड कनेक्टर सुरक्षित है।',
        directives: [
          'बीकेसी चुनाभट्टी कनेक्टर पूरी तरह खुला और सुरक्षित है',
          'बीकेसी जी-ब्लॉक के बेसमेंट पार्किंग में वाहन न खड़े करें',
          'कलानगर अंडरपास में २८ सेमी जलभराव',
          'वाकोला नाले के पास भारी वाहनों का प्रवेश प्रतिबंधित'
        ]
      }
    }
  },
  {
    id: 'alt-103',
    severity: 'caution',
    hazardCategory: 'subway',
    title: 'TRAFFIC DIVERSION: Milan Subway Waterlogging',
    ward: 'K-West',
    wardName: 'Ward K-West — Andheri West & Santacruz',
    coordinates: { lat: 19.0825, lng: 72.8410 },
    issuedAt: '35 mins ago',
    timestamp: Date.now() - 35 * 60 * 1000,
    validUntil: 'T+180 min (00:15 IST)',
    waterDepth: 22,
    waterDepthTrend: 'Stationary (pumping active)',
    rainfallRate: 36,
    vehicleMaxClearance: 15,
    sensorId: 'CCTV-K114-ULTRASONIC',
    cctvCameraId: 'CCTV-KW-014',
    message: 'Submersible dewatering pumps operating at 80% duty cycle (450 m³/hr discharge into Gazdarband outfall). Light motor vehicles diverted to Milan Flyover.',
    directives: [
      'Use Milan Flyover for Santacruz East-West connectivity without delay',
      'Two-wheelers strictly prohibited from entering barrel due to hidden sump trench',
      'Pedestrian foot-over-bridge remains well-lit and fully operational'
    ],
    soundAlert: 'Milan subway waterlogging diversion in effect. Please use Milan Flyover.',
    acknowledged: true,
    acknowledgedAt: '12 mins ago',
    userCheckedDirectives: { 0: true },
    crowdsourced: {
      risingVotes: 14,
      recedingVotes: 38,
      blockedReports: 45,
      rescueRequests: 0,
      lastReportedMinsAgo: 8
    },
    telemetry: [
      { time: '19:00', depth: 10, rain: 20 },
      { time: '19:30', depth: 18, rain: 35 },
      { time: '20:00', depth: 24, rain: 42 },
      { time: '20:30', depth: 22, rain: 36 },
      { time: '21:00 (Forecast)', depth: 18, rain: 24, isForecast: true },
      { time: '21:30 (Forecast)', depth: 8, rain: 12, isForecast: true }
    ],
    shelterRecommendation: {
      name: 'Santacruz Municipal Relief Hall',
      distance: '1.1 km',
      elevation: '+12m MSL',
      capacity: '180 beds available',
      address: 'Near Podar School, Santacruz West',
      shelterId: 'safe-03'
    },
    emergencyContacts: {
      wardControlDesk: '022-26239131',
      wardOfficer: 'Mr. V. Sawant (9820223490)',
      fireStation: 'Santacruz Fire Brigade (022-26602222)',
      ndrfBattalion: 'Traffic Helpline Control: 8454999999'
    },
    translations: {
      mr: {
        title: 'वाहतूक वळवली: मिलन सबवे पाणी साचले',
        message: 'मिलन सबवेमध्ये पाण्याचा निचरा करण्यासाठी सबमर्सिबल पंप ८०% क्षमतेने कार्यरत. हलकी वाहने मिलन उड्डाणपुलावरून वळवण्यात आली आहेत.',
        soundAlert: 'मिलन सबवे वाहतूक वळवली. कृपया मिलन उड्डाणपुलाचा वापर करा.',
        directives: [
          'सांताक्रूझ पूर्व-पश्चिम प्रवासासाठी मिलन उड्डाणपुलाचा वापर करा',
          'दुचाकीस्वारांना सबवेच्या मुख्य मार्गात जाण्यास सक्त मनाई आहे',
          'पादचारी पूल खुला आणि सुरक्षित आहे'
        ]
      },
      hi: {
        title: 'यातायात डायवर्जन: मिलन सबवे जलभराव',
        message: 'मिलन सबवे में पानी निकालने वाले पंप पूरी क्षमता से चालू। हल्के वाहनों को मिलन फ्लाईओवर पर डायवर्ट किया गया है।',
        soundAlert: 'मिलन सबवे जलभराव डायवर्जन। कृपया मिलन फ्लाईओवर का उपयोग करें।',
        directives: [
          'सांताक्रूज पूर्व-पश्चिम आवागमन के लिए मिलन फ्लाईओवर का उपयोग करें',
          'दोपहिया वाहनों का सबवे में प्रवेश पूरी तरह से प्रतिबंधित',
          'पैदल पारपथ ब्रिज पूरी तरह चालू है'
        ]
      }
    }
  },
  {
    id: 'alt-104',
    severity: 'advisory',
    hazardCategory: 'cloudburst',
    title: 'BMC MONSOON ADVISORY: Cloudburst Radar Vector Shift',
    ward: 'Citywide',
    wardName: 'Citywide Metropolitan Coverage',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    issuedAt: '52 mins ago',
    timestamp: Date.now() - 52 * 60 * 1000,
    validUntil: 'T+180 min (00:30 IST)',
    waterDepth: 12,
    waterDepthTrend: 'Migrating southeast',
    rainfallRate: 48,
    vehicleMaxClearance: 30,
    sensorId: 'DOPPLER-SANTACRUZ-45DBZ',
    cctvCameraId: 'CCTV-CITY-RADAR',
    message: 'IMD Doppler Radar Santacruz indicates a 48 dBZ convective storm cloud migrating southeast towards Kurla, Chembur, and Trombay basin over next 45 minutes.',
    directives: [
      'Commuters advised to conclude non-essential travel across LBS Marg prior to 21:30',
      'Keep mobile devices charged; emergency cell lines open on BMC 1916',
      'Follow official BMC updates; avoid spreading unverified WhatsApp rumors'
    ],
    soundAlert: 'BMC Advisory: Convective cloudburst storm cell moving towards Kurla and Chembur.',
    acknowledged: true,
    acknowledgedAt: '40 mins ago',
    userCheckedDirectives: { 0: true, 1: true },
    crowdsourced: {
      risingVotes: 22,
      recedingVotes: 18,
      blockedReports: 12,
      rescueRequests: 0,
      lastReportedMinsAgo: 14
    },
    telemetry: [
      { time: '18:45', depth: 4, rain: 12 },
      { time: '19:15', depth: 8, rain: 28 },
      { time: '19:45', depth: 12, rain: 45 },
      { time: '20:15', depth: 12, rain: 48 },
      { time: '20:45 (Forecast)', depth: 16, rain: 40, isForecast: true },
      { time: '21:15 (Forecast)', depth: 10, rain: 18, isForecast: true }
    ],
    shelterRecommendation: {
      name: 'Kurla West Municipal School Relief Hub',
      distance: '1.4 km',
      elevation: '+9m MSL',
      capacity: '260 beds available',
      address: 'Near Kurla Railway Station West',
      shelterId: 'safe-04'
    },
    emergencyContacts: {
      wardControlDesk: '022-26505103',
      wardOfficer: 'BMC Central Control Room (1916)',
      fireStation: 'Kurla Fire Station (022-25034101)',
      ndrfBattalion: 'Mumbai Police Control: 100 / 112'
    },
    translations: {
      mr: {
        title: 'महापालिका मान्सून सल्ला: ढगफुटी रडार दिशा बदल',
        message: 'सांताक्रूझ डॉप्लर रडारनुसार ४८ dBZ वादळी ढगांचे पट्टे कुर्ला, चेंबूर आणि तुर्भेच्या दिशेने पुढील ४५ मिनिटांत वेगाने सरकत आहेत.',
        soundAlert: 'महापालिका सल्ला: वादळी ढग कुर्ला आणि चेंबूरच्या दिशेने सरकत आहेत.',
        directives: [
          'एलबीएस मार्गावरील अत्यावश्यक नसलेला प्रवास २१:३० पूर्वी संपवा',
          'मोबाईल चार्ज ठेवा; आपत्कालीन नियंत्रण कक्ष १९१६ वर संपर्कात राहा',
          'फक्त अधिकृत सूचनांवर विश्वास ठेवा, अफवांवर विश्वास ठेवू नका'
        ]
      },
      hi: {
        title: 'बीएमसी मानसून परामर्श: बादलों का रडार बहाव',
        message: 'सांताक्रूज डॉपलर रडार के अनुसार ४८ dBZ तूफानी बादलों का समूह अगले ४५ मिनट में कुर्ला और चेंबूर की ओर बढ़ रहा है।',
        soundAlert: 'बीएमसी परामर्श: तूफानी बादल कुर्ला और चेंबूर की ओर बढ़ रहे हैं।',
        directives: [
          'एलबीएस मार्ग पर गैर-जरूरी यात्रा २१:३० से पहले पूरी करें',
          'मोबाइल चार्ज रखें; आपातकालीन नंबर १९१६ चालू है',
          'आधिकारिक सूचनाओं का ही पालन करें'
        ]
      }
    }
  },
  {
    id: 'alt-105',
    severity: 'critical',
    hazardCategory: 'drain-breach',
    title: 'STORM DRAIN BREACH: Saki Naka & 90-Feet Road Outfall',
    ward: 'Ward L',
    wardName: 'Ward L — Kurla & Saki Naka West',
    coordinates: { lat: 19.1020, lng: 72.8870 },
    issuedAt: '4 mins ago',
    timestamp: Date.now() - 4 * 60 * 1000,
    validUntil: 'T+60 min (22:15 IST)',
    waterDepth: 42,
    waterDepthTrend: '+6 cm / 10m',
    rainfallRate: 72,
    vehicleMaxClearance: 18,
    sensorId: 'ULTRASONIC-SAKI-09',
    cctvCameraId: 'CCTV-L-201',
    message: 'Debris bottleneck has breached the masonry storm culvert at 90-Feet road junction. Rapid water surge spreading across market square. Saki Naka Metro Gate 2 closed.',
    directives: [
      'Avoid 90-Feet Road junction completely; water velocity is 1.2 m/s',
      'Use Saki Naka Metro station upper concourse as elevated pedestrian refuge',
      'Do not enter ground-floor shops on Khairani Road due to mud slurry ingress',
      'NDRF boat team en-route from Kurla depot'
    ],
    soundAlert: 'Storm drain breach warning at Saki Naka 90-Feet Road. Dangerous water surge. Use Metro elevated concourse.',
    acknowledged: false,
    acknowledgedAt: null,
    userCheckedDirectives: {},
    crowdsourced: {
      risingVotes: 112,
      recedingVotes: 1,
      blockedReports: 78,
      rescueRequests: 8,
      lastReportedMinsAgo: 1
    },
    telemetry: [
      { time: '19:40', depth: 10, rain: 30 },
      { time: '20:00', depth: 22, rain: 52 },
      { time: '20:20', depth: 34, rain: 68 },
      { time: '20:40', depth: 42, rain: 72 },
      { time: '21:00 (Forecast)', depth: 46, rain: 65, isForecast: true },
      { time: '21:30 (Forecast)', depth: 35, rain: 30, isForecast: true }
    ],
    shelterRecommendation: {
      name: 'Asalpha Hill Municipal Relief School',
      distance: '750m',
      elevation: '+26m MSL',
      capacity: '210 spaces',
      address: 'Subhash Nagar, Asalpha Hill (Elevated Ridge)',
      shelterId: 'safe-05'
    },
    emergencyContacts: {
      wardControlDesk: '022-26505103',
      wardOfficer: 'Mr. R. Jadhav (9820778811)',
      fireStation: 'Kurla Fire Station (022-25034101)',
      ndrfBattalion: 'NDRF Quick Rescue Unit 2 (9423578912)'
    },
    translations: {
      mr: {
        title: 'नाले फुटल्याचा इशारा: साकीनाका आणि ९० फूट रोड',
        message: 'कचरा अडकल्याने ९० फूट रस्त्यावरील मुख्य नाला फुटला आहे. वेगाने वाहणारे पाणी बाजार चौकात पसरले आहे. साकीनाका मेट्रो गेट २ बंद.',
        soundAlert: 'साकीनाका ९० फूट रस्त्यावर नाला फुटला आहे. वेगाने पाणी वाढत आहे. सुरक्षित ठिकाणी थांबा.',
        directives: [
          '९० फूट रस्ता जंक्शन पूर्णपणे टाळा; पाण्याचा वेग १.२ मी/सेकंद आहे',
          'साकीनाका मेट्रो स्थानकाच्या वरच्या मजल्याचा सुरक्षित आसरा म्हणून वापर करा',
          'खैराणी रोडवरील तळमजल्यावरील दुकानांमध्ये जाणे टाळा',
          'एनडीआरएफ पथक रवाना झाले आहे'
        ]
      },
      hi: {
        title: 'तूफानी नाला टूटने की चेतावनी: साकीनाका ९० फीट रोड',
        message: 'कचरा जमा होने से ९० फीट रोड पर बड़ा नाला टूट गया है। बाजार में तेज बहाव के साथ पानी भर रहा है। साकीनाका मेट्रो गेट २ बंद।',
        soundAlert: 'साकीनाका ९० फीट रोड पर नाला ओवरफ्लो। तेज बहाव से बचें। मेट्रो स्टेशन के ऊपरी तल का उपयोग करें।',
        directives: [
          '९० फीट रोड जंक्शन की तरफ न जाएं; पानी का बहाव १.२ मीटर/सेकंड',
          'साकीनाका मेट्रो स्टेशन के ऊपरी कॉनकोर्स पर शरण लें',
          'खैरानी रोड पर दुकानों के बेसमेंट में जाने से बचें',
          'एनडीआरएफ बचाव दल मौके पर पहुंच रहा है'
        ]
      }
    }
  }
];

export const HAZARD_CATEGORIES = [
  { id: 'all', label: 'All Hazards', icon: 'Layers' },
  { id: 'cloudburst', label: 'Cloudburst & Flash Flood', icon: 'CloudRain' },
  { id: 'high-tide', label: 'High Tide Confluence', icon: 'Waves' },
  { id: 'subway', label: 'Subway & Underpass Ingress', icon: 'GitCommit' },
  { id: 'drain-breach', label: 'Drain Breach & Overflow', icon: 'AlertTriangle' },
  { id: 'railway', label: 'Railway Water Stoppage', icon: 'Train' }
];

export const SIREN_PRESETS = [
  {
    id: 'siren-disaster',
    name: 'Metropolitan Flash Flood Siren',
    type: 'wail',
    baseFreq: 440,
    maxFreq: 880,
    cycleMs: 2500,
    decibelSim: 110,
    description: 'Continuous wailing tone for mandatory high-ground relocation.'
  },
  {
    id: 'siren-evacuate',
    name: 'Subway / Lowland Evacuation Klaxon',
    type: 'yelp',
    baseFreq: 600,
    maxFreq: 1100,
    cycleMs: 800,
    decibelSim: 115,
    description: 'Rapid pulsed warning signal for immediate vehicular barrier closures.'
  },
  {
    id: 'siren-allclear',
    name: 'Basin Recession All-Clear Chime',
    type: 'chime',
    baseFreq: 523.25,
    maxFreq: 659.25,
    cycleMs: 1500,
    decibelSim: 78,
    description: 'Gentle harmonic chime indicating falling flood levels and passable roads.'
  }
];

export const WARDS_LIST = [
  { id: 'all', name: 'All Metropolitan Wards' },
  { id: 'F-North', name: 'Ward F-North (Sion / Matunga / Hindmata)' },
  { id: 'H-East', name: 'Ward H-East (Bandra East / BKC / Kalina)' },
  { id: 'K-West', name: 'Ward K-West (Andheri West / Milan Subway)' },
  { id: 'K-East', name: 'Ward K-East (Andheri East / Saki Naka)' },
  { id: 'Ward L', name: 'Ward L (Kurla / Chunabhatti)' },
  { id: 'G-North', name: 'Ward G-North (Dharavi / Mahim)' },
  { id: 'Citywide', name: 'Citywide Directives' }
];

export const DEFAULT_GOBAG_ITEMS = [
  { id: 'gb-1', label: 'Waterproof bag with Aadhar, PAN, Property cards', category: 'Documents', checked: true },
  { id: 'gb-2', label: '72-hour supply of essential prescription medicines', category: 'Medical', checked: true },
  { id: 'gb-3', label: 'Power bank (20,000 mAh) + charging cables', category: 'Electronics', checked: true },
  { id: 'gb-4', label: 'Waterproof LED torch / headlamp with spare cells', category: 'Safety', checked: false },
  { id: 'gb-5', label: '3 Litres sealed drinking water & ORS packets', category: 'Rations', checked: false },
  { id: 'gb-6', label: 'High-calorie non-perishable energy bars / nuts', category: 'Rations', checked: false },
  { id: 'gb-7', label: 'Loud acoustic safety whistle for rescue signaling', category: 'Safety', checked: false },
  { id: 'gb-8', label: 'First aid antiseptic wipes, gauze & waterproof tape', category: 'Medical', checked: false },
  { id: 'gb-9', label: 'Cash in small denominations (₹100, ₹200 notes)', category: 'Finance', checked: false },
  { id: 'gb-10', label: 'High-visibility fluorescent reflective poncho', category: 'Safety', checked: false }
];

export const RIVER_BASINS_DATA = [
  {
    id: 'riv-mithi',
    name: 'Mithi River (Kurla - BKC Basin)',
    currentLevelM: 3.92,
    warningLevelM: 3.60,
    dangerLevelM: 4.10,
    rateOfRiseMPerHour: '+0.22 m/h',
    status: 'DANGER',
    sluiceGateStatus: 'Closed (Tidal Backflow Prevention)',
    sluicePumpsActive: 12,
    catchmentRainfallMm: 68
  },
  {
    id: 'riv-dahisar',
    name: 'Dahisar River (Borivali - Dahisar)',
    currentLevelM: 2.45,
    warningLevelM: 2.80,
    dangerLevelM: 3.40,
    rateOfRiseMPerHour: '+0.08 m/h',
    status: 'SAFE',
    sluiceGateStatus: 'Gravity Discharge Open',
    sluicePumpsActive: 2,
    catchmentRainfallMm: 32
  },
  {
    id: 'riv-poisar',
    name: 'Poisar River (Kandivali Outfall)',
    currentLevelM: 2.85,
    warningLevelM: 2.90,
    dangerLevelM: 3.50,
    rateOfRiseMPerHour: '+0.15 m/h',
    status: 'WARNING',
    sluiceGateStatus: 'Partial Flap Open',
    sluicePumpsActive: 4,
    catchmentRainfallMm: 45
  },
  {
    id: 'riv-oshiwara',
    name: 'Oshiwara River (Jogeshwari - Lokhandwala)',
    currentLevelM: 2.30,
    warningLevelM: 2.70,
    dangerLevelM: 3.30,
    rateOfRiseMPerHour: '+0.05 m/h',
    status: 'SAFE',
    sluiceGateStatus: 'Gravity Discharge Open',
    sluicePumpsActive: 3,
    catchmentRainfallMm: 28
  }
];

export const SUBWAYS_GRID_DATA = [
  {
    id: 'sub-milan',
    name: 'Milan Subway (Santacruz)',
    status: 'RESTRICTED',
    depthCm: 22,
    passableFor: ['Heavy Bus', 'Emergency SUV'],
    impassableFor: ['Sedan', 'Hatchback', 'Two-Wheeler', 'Pedestrian'],
    detourRecommendation: 'Milan Flyover (Open)',
    pumpStatus: '3 of 3 Active (78% Capacity)'
  },
  {
    id: 'sub-andheri',
    name: 'Andheri Subway',
    status: 'RESTRICTED',
    depthCm: 24,
    passableFor: ['Heavy Bus', 'Fire Engine'],
    impassableFor: ['Sedan', 'Two-Wheeler', 'Auto'],
    detourRecommendation: 'Gokhale Bridge Overpass (Open)',
    pumpStatus: '2 of 3 Active (85% Capacity)'
  },
  {
    id: 'sub-khar',
    name: 'Khar Subway (SV Rd - Golibar)',
    status: 'CLOSED',
    depthCm: 44,
    passableFor: ['None'],
    impassableFor: ['All Vehicles', 'Pedestrians'],
    detourRecommendation: 'Bandra Reclamation / Linking Road Overbridge',
    pumpStatus: 'Pumps Submerged (Repair Crew Onsite)'
  },
  {
    id: 'sub-malad',
    name: 'Malad Subway (Subway Rd)',
    status: 'OPEN',
    depthCm: 8,
    passableFor: ['All Vehicles', 'Pedestrians with Caution'],
    impassableFor: [],
    detourRecommendation: 'Normal flow, maintain 20 km/h',
    pumpStatus: '2 of 2 Operating Smoothly'
  },
  {
    id: 'sub-kings',
    name: 'King’s Circle / Gandhi Market Underpass',
    status: 'CLOSED',
    depthCm: 41,
    passableFor: ['None'],
    impassableFor: ['All Traffic'],
    detourRecommendation: 'Tilak Bridge Elevated Corridor',
    pumpStatus: '4 of 4 Max Capacity Discharge'
  },
  {
    id: 'sub-mankhurd',
    name: 'Mankhurd Railway Underpass',
    status: 'OPEN',
    depthCm: 11,
    passableFor: ['All Vehicles'],
    impassableFor: [],
    detourRecommendation: 'Normal Flow',
    pumpStatus: '1 of 1 Active'
  },
  {
    id: 'sub-dahisar',
    name: 'Dahisar Checknaka Subway',
    status: 'OPEN',
    depthCm: 6,
    passableFor: ['All Vehicles'],
    impassableFor: [],
    detourRecommendation: 'Normal Flow',
    pumpStatus: 'Standby'
  }
];

export const RELIEF_SHELTERS_DATA = [
  {
    id: 'sh-1',
    name: 'BMC SIES Municipal School Relief Camp',
    ward: 'Ward F-North',
    location: 'Sion West, Near SIES College',
    elevationM: 14.5,
    distanceKm: '1.2 km',
    totalCapacity: 450,
    currentOccupants: 128,
    facilities: ['Clean Drinking Water', 'Medical First Aid Desk', 'Infant Care Rations', 'Mobile Charging Station'],
    contactPhone: '022-24071199',
    status: 'ACCEPTING CITIZENS'
  },
  {
    id: 'sh-2',
    name: 'Kurla Municipal High School & Community Hall',
    ward: 'Ward L',
    location: 'Bail Bazar Road, Kurla West',
    elevationM: 12.2,
    distanceKm: '0.8 km',
    totalCapacity: 600,
    currentOccupants: 342,
    facilities: ['Emergency Doctor on Duty', 'Hot Meal Distribution', 'Dry Blanket Kits', 'Security Guarded'],
    contactPhone: '022-26508822',
    status: 'ACCEPTING CITIZENS'
  },
  {
    id: 'sh-3',
    name: 'Bandra Kurla Complex Multi-Purpose Relief Hub',
    ward: 'Ward H-East',
    location: 'MMRDA Ground 3, BKC',
    elevationM: 16.0,
    distanceKm: '2.4 km',
    totalCapacity: 800,
    currentOccupants: 110,
    facilities: ['NDRF Rescue Boat Dock', 'Backup Generator 120kVA', 'Ambulance Standby', 'Sanitation Blocks'],
    contactPhone: '022-26590000',
    status: 'ACCEPTING CITIZENS'
  },
  {
    id: 'sh-4',
    name: 'Santacruz Municipal Maternity & Disaster Annex',
    ward: 'Ward K-West',
    location: 'Near Poddar Sports Ground, Santacruz West',
    elevationM: 15.2,
    distanceKm: '1.9 km',
    totalCapacity: 350,
    currentOccupants: 85,
    facilities: ['Doctor & Pediatrician', 'Oxygen Concentrators', 'Pure Drinking Water Tanker', 'Dry Clothing'],
    contactPhone: '022-26604433',
    status: 'ACCEPTING CITIZENS'
  }
];

export const UTILITY_OUTAGE_DATA = [
  {
    sector: 'BEST Power Grid — Hindmata Feeder 4',
    status: 'DE-ENERGIZED FOR SAFETY',
    reason: 'Preventive isolation due to water level exceeding 35 cm curb threshold',
    affectedStreets: 'Gandhi Market, Khodadad Circle service lanes',
    etaRestoration: 'Upon water recession below 15 cm'
  },
  {
    sector: 'Drinking Water Supply — Kalina Tanker Station',
    status: 'OPERATIONAL WITH BOIL ADVISORY',
    reason: 'Supply pipes pressurized; boil water for 5 mins due to surface runoff ingress precaution',
    affectedStreets: 'CST Road, Kalina Village, Kurla West',
    etaRestoration: 'Continuous'
  },
  {
    sector: 'Mobile Cell Towers (Jio / Airtel / Vi) — BKC G-Block',
    status: 'ON BATTERY BACKUP (4.5h remaining)',
    reason: 'Substation shut off; backup diesel generator switched to auto-cycle',
    affectedStreets: 'BKC Central Avenue',
    etaRestoration: 'Auxiliary fuel truck dispatched'
  }
];

export const TIDAL_CONFLUENCE_DATA = {
  highTideTime: '18:45 IST',
  highTideHeightM: 4.42,
  nextLowTideTime: '00:52 IST',
  nextLowTideHeightM: 1.15,
  criticalThresholdM: 4.00,
  confluenceRiskLevel: 'HIGH (SURCHARGE ACTIVE)',
  sluiceFlapStatus: 'CLOSED (16 of 18 Coastal Gates Shut)',
  pumpingStationsOnline: 'Love Grove (Worli), Britannia (Reay Rd), Cleave Land (Dadar), Gazdarband (Khar)'
};

export const EMERGENCY_HELPLINES = [
  { name: 'BMC Disaster Control Room', number: '1916', desc: 'Waterlogging, Tree Falls, Relief Camp Dispatch', isTollFree: true, primary: true },
  { name: 'Mumbai Police Emergency', number: '112', desc: 'Stranded Citizens, Road Blockades & Evacuations', isTollFree: true, primary: true },
  { name: 'Fire & Flood Rescue Brigade', number: '101', desc: 'Inflatable Boat Rescues & Submerged Vehicles', isTollFree: true, primary: false },
  { name: 'NDRF Control Room (Maharashtra)', number: '1078', desc: 'National Disaster Response Heavy Lifters', isTollFree: true, primary: false },
  { name: 'State Emergency Ambulance', number: '108', desc: 'Medical Trauma, Oxygen & Waterborne First Aid', isTollFree: true, primary: false },
  { name: 'Mumbai Traffic Police WhatsApp', number: '8454999999', desc: 'Live Traffic Jam & Waterlogged Route Updates', isTollFree: false, primary: false }
];


