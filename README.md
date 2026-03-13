# Sophiate CTA Page

3Dインタラクティブなランディングページ（銀河＋流れ星演出）

## ローカル確認

```bash
npm install
npm run dev
```

http://localhost:5173 で確認できます。

## Vercelデプロイ手順

### 1. GitHubリポジトリ作成

```bash
# このフォルダ内で
git init
git add .
git commit -m "initial commit"

# GitHubで新規リポジトリ作成後
git remote add origin https://github.com/YOUR_USER/sophiate-cta.git
git branch -M main
git push -u origin main
```

### 2. Vercelに接続

1. [vercel.com](https://vercel.com) にログイン（GitHubアカウント連携）
2. 「Add New → Project」
3. GitHubリポから `sophiate-cta` をインポート
4. Framework Preset: **Vite** が自動検出される
5. 「Deploy」をクリック

→ 数十秒で `https://sophiate-cta.vercel.app` のようなURLが発行されます。

### 3. メールのURLを差し替え

HTMLメール内の `https://YOUR-CTA-PAGE-URL.vercel.app` を、
Vercelで発行された実際のURLに置き換えてください。

## カスタムドメイン（任意）

Vercelダッシュボード → Settings → Domains から
`cta.sophiate.co.jp` 等を設定可能です。
