# VOID.STORE v2

由 `null0dv/ideaauto` 的設計語言重寫,保留 void.store 的黑色識別。

## Stack

- Next.js 15 (App Router) · React 19
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- `lucide-react` 圖示 · `next/font` 內嵌 Syne + DM Mono
- 目前用 `lib/products.ts` 的 mock 資料。要接 Supabase 時,實作 `getProducts` / `getProduct` 即可。

## Design tokens

`app/globals.css`:

- `--background #08080a` · `--ink #ededec` · `--card #131317`
- `--primary #ff6a3d`(從 IDEAAUTO `#df562f` 提亮以適合深底)
- `--sun #f5c451`(不變,accent 用)
- 字體:`Syne` 為顯示字,`DM Mono` 為 eyebrow / chip / 分頁按鈕
- 圓角 `--radius: .9rem`,大卡片 `rounded-[1.4rem]` / hero `rounded-[2rem]`

## 頁面

| 路徑 | 檔案 |
|---|---|
| `/` | `app/page.tsx` — hero + 系列卡 + 最新上架 + how it works |
| `/products` | `app/products/page.tsx` — 系列 tabs + 搜尋 + 分頁 |
| `/products/[slug]` | `app/products/[slug]/page.tsx` — 商品頁 + 同系列 |
| `/upload` | `app/upload/page.tsx` — 上架表單(client) |
| `/admin` | `app/admin/page.tsx` — 密碼登入 |

## API

- `GET  /api/products` — 回傳 demo products
- `POST /api/upload` — 接收上傳 form,現在只回 `{ ok: true }`(接 Supabase 時在這裡寫入)
- `POST /api/session` / `DELETE /api/session` — cookie 登入 / 登出

## Run

```bash
cd C:/Users/Administrator/void-store-v2
npm install
npm run dev
```

打開 http://localhost:3000。

## 待接

- [ ] `lib/products.ts` 換成 Supabase 讀寫(承接舊 `product-upload-site/lib/product-store.js` 的邏輯)
- [ ] `/api/upload` 寫入儲存體(Supabase bucket 或本地 uploads/)
- [ ] `/api/session` 換成 scrypt hash 比對(參考舊 `server.js` 的 `verifyPassword`)
- [ ] `public/demo/*.jpg` 補上實際圖片(現在會 404,先用 placeholder)
- [ ] 購物車、`ON AND ON` subuser、LINE 群組按鈕(舊版有,尚未移植)

## 舊版位置

`C:\Users\Administrator\product-upload-site\` — 沒動,可以並存。
