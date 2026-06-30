# BsKitaplik

Angular tabanlı kişisel kütüphane uygulaması. Kullanıcı okuduğu, okuyacağı ve okumakta olduğu kitapları takip edebilir; ekleme, düzenleme, silme işlemleri yapabilir; tür ve duruma göre filtreleyip arama yapabilir.

## Kurulum

```bash
npm install
ng serve
```

Tarayıcıda `http://localhost:4200` adresini açın.

## Mimari

Özellik bazlı (feature-based) mimari kullanılmıştır.

```
src/app/
├── core/          StorageService, UnsavedChangesGuard, modeller
├── shared/        DataTable, ConfirmDialog, FormField, EmptyState, LoadingSpinner, pipe, directive, validator
├── features/books Kitaplar özelliği (liste sayfası, form sayfası, servis, model, route)
├── app.ts         Ana uygulama bileşeni
├── app.config.ts  Uygulama yapılandırması
└── app.routes.ts  Ana yönlendirme
```

## Teknolojiler

- **Angular 22** — standalone component, Signals API, Reactive Forms
- **RxJS** — BehaviorSubject ile servis katmanı
- **Tailwind CSS** — responsive arayüz
- **localStorage** — veri saklama (yalnızca StorageService üzerinden)
- **Lazy Loading** — feature sayfaları loadComponent/loadChildren ile yüklenir

## Özellikler

- **CRUD** — Kitap ekleme, listeleme, düzenleme, silme
- **Arama** — Kitap adı veya yazara göre anlık arama
- **Filtreleme** — Tür ve okuma durumuna göre filtreleme
- **Sıralama** — Eklenme tarihi, puan veya ada göre sıralama
- **Okuma Durumu** — Okunacak / Okunuyor / Okundu
- **Puanlama** — 1-5 arası puan
- **Onay Penceresi** — Silme işleminde ConfirmDialog
- **Responsive** — Mobil ve masaüstü uyumlu

## Özel Yapı Taşları

### Custom Pipe: `StatusTextPipe`
- **Dosya:** `src/app/shared/pipes/status-text.pipe.ts`
- **Kullanım:** `{{ kitap.durum | statusText }}` — `'okundu'` değerini `'Okundu'` olarak gösterir
- **Kullanıldığı yer:** DataTable bileşeni (badge kolon tipi)

### Custom Directive: `StatusColorDirective`
- **Dosya:** `src/app/shared/directives/status-color.directive.ts`
- **Kullanım:** `<span statusColor="okundu">` — duruma göre kırmızı/sarı/yeşil rozet rengi ekler
- **Kullanıldığı yer:** DataTable bileşeni (badge kolon tipi)

### Custom Validator: `scoreValidator`
- **Dosya:** `src/app/shared/validators/score-validator.ts`
- **Kullanım:** `puan: new FormControl(null, [scoreValidator()])` — 1-5 arası tam sayı kontrolü
- **Kullanıldığı yer:** BooksForm sayfası

### Route Guard: `UnsavedChangesGuard`
- **Dosya:** `src/app/core/guards/unsaved-changes.guard.ts`
- **Kullanım:** Form sayfasından kaydetmeden çıkarken uyarı gösterir
- **Kullanıldığı yer:** `/kitaplar/ekle` ve `/kitaplar/:id/duzenle` rotaları
