import { useState } from "react";

const SERVICE_DOC_URL =
  "https://drive.google.com/file/d/1MBBVGYKNeoR6N62pnY1iZTr1YrrteF9h/view?usp=sharing";

const DEMOS = [
  {
    id: "kanemiel",
    title: "カネミエル",
    subtitle: "建設業向けキャッシュフロー見える化",
    category: "建設 / 財務",
    accent: "#4f6bf5",
    url: "https://taigasorimachi.github.io/kanemiel/",
    tags: ["現場別残高", "支払承認", "資金繰り予測"],
    overview:
      "建設業の資金管理をワンストップで実現するダッシュボード。現場ごとの残高・支払承認フロー・将来の資金繰り予測をリアルタイムに可視化し、経営者が現場単位の収支と会社全体のキャッシュ状況を同じ画面で把握できる。",
    challenge:
      "建設業は着工から入金までのサイクルが長く、複数現場の収支がバラバラに管理されるため資金ショートに気づくのが遅れやすい。現状はExcelと担当者の勘に依存しており、経営者がリアルタイムに判断できる手段が存在しない。",
  },
  {
    id: "nursing-shift",
    title: "介護シフト自動生成",
    subtitle: "18名×31日を2秒で組むシフト最適化",
    category: "介護 / 労務",
    accent: "#0ea5b7",
    url: "https://nursing-shift-generator.vercel.app/",
    tags: ["希望休考慮", "資格・相性", "労基適合"],
    overview:
      "介護施設のシフト作成を自動化するWebアプリ。職員の希望休・保有資格・相性・労働基準法上の制約を考慮しながら、18名×31日のシフトを2秒以内に生成。自動生成結果/本人希望/管理者調整を3層で並べ表示し、配置基準の充足率とワークロードバランスをリアルタイム監視できる。",
    challenge:
      "シフト作成は月25時間を要する職場も多く、法令と相性・希望休を同時に満たすのは属人的な職人技になっていた。急な欠員や希望変更への対応にも時間がかかり、作成担当者が疲弊しているケースが多い。",
  },
  {
    id: "site-report",
    title: "現場日報 & マッチング",
    subtitle: "管理者ダッシュボード + 現場ユーザー入力",
    category: "建設 / SaaS",
    accent: "#7b2ff7",
    url: "https://srm-demo-admin.vercel.app/reports",
    secondaryUrl: "https://site-report-match.vercel.app/report",
    secondaryLabel: "ユーザー側を見る",
    tags: ["日報投稿", "管理ダッシュボード", "マッチング"],
    overview:
      "現場作業員による日報投稿と、管理者側の一元管理を兼ね備えたSaaS。管理者は全現場の日報を横断的に閲覧・承認でき、ユーザーはスマホから現場で日報を即時入力。さらに案件と作業員のマッチング機能を組み合わせ、日報データを人員配置にもつなげる。",
    challenge:
      "現場の日報が紙やLINEに散在し、管理者が全現場の状況を把握できない。報告の抜け漏れや伝達遅延は、安全管理・工程管理・請求業務すべてのリスクとなるが、現場側に負担の少ない報告手段が存在していない。",
  },
  {
    id: "engineer-assessment",
    title: "エンジニア診断",
    subtitle: "スキル・特性をプロファイリング",
    category: "HR / 開発",
    accent: "#4f6bf5",
    url: "https://engineer-assessment-sigma.vercel.app/",
    tags: ["スキル可視化", "適性診断", "採用・編成"],
    overview:
      "エンジニアのスキルと特性をプロファイリングする診断ツール。経験領域・得意技術・思考スタイル・チーム内での役割傾向を複数軸で可視化し、採用判断やチームアサインの意思決定を支える客観データを提供する。",
    challenge:
      "エンジニア採用やチーム編成では、面談の印象や自己申告に頼る評価が横行している。スキルと適性を客観的に可視化する共通指標がないため、ミスマッチや期待ズレが頻発し、採用コストと離職リスクを押し上げている。",
  },
  {
    id: "itpm-mbti",
    title: "IT PM MBTI診断",
    subtitle: "開発PMのタイプ・レベル診断",
    category: "HR / PM",
    accent: "#0ea5b7",
    url: "https://itpm-mbti.vercel.app/",
    tags: ["PM診断", "タイプ分類", "育成計画"],
    overview:
      "開発プロジェクトマネージャーのタイプとレベルを診断するツール。コミュニケーション・リスク管理・要件整理・チームビルディングなど複数観点からPMの強みと伸びしろを可視化し、案件アサインと育成計画の判断材料にする。",
    challenge:
      "PMの力量差はプロジェクトの成否を大きく左右するにもかかわらず、評価基準が属人的で数値化されていない。定量的なPM把握手段がないため、適切なアサインも育成計画も立てにくい状態が続いている。",
  },
  {
    id: "elearning-lms",
    title: "スクール特化LMS",
    subtitle: "Admin / Teacher / Student 3ロールLMS",
    category: "教育 / SaaS",
    accent: "#7b2ff7",
    url: "https://demo-elearning-ebon.vercel.app/",
    tags: ["動画学習", "課題管理", "KPI分析"],
    overview:
      "小〜中規模スクール運営に特化したLMS。Admin/Teacher/Studentの3ロール構成で、動画学習・課題管理・KPI分析までを一貫で提供。受講進捗・離脱兆候・課題提出状況を運営者視点で俯瞰でき、スクール運営実務にフィットした導線で設計されている。",
    challenge:
      "中小規模のスクールには、大手向けの高額なLMS SaaS か、機能不足の汎用ツールの組み合わせという二択しかなかった。生徒の進捗把握や離脱防止が手作業になりやすく、運営担当者の時間がオペレーション業務に奪われている。",
  },
  {
    id: "sophiate-cta",
    title: "3D CTAランディング",
    subtitle: "インパクトメール用の没入型LP",
    category: "営業 / マーケ",
    accent: "#4f6bf5",
    url: "https://sophiate-cta.vercel.app/",
    tags: ["Three.js", "営業メール", "CVR改善"],
    overview:
      "営業メールに添付するインパクト用ランディングページ。3Dアニメーションの銀河ビジュアル上にコーポレートメッセージとCTAを配置し、メール開封後のユーザーを視覚体験で引き込みながらコンバージョン動線へ誘導する。",
    challenge:
      "営業メールの開封後CVRは極めて低く、テキストと画像だけでは他社と差別化できない。受信者の関心を一瞬で掴み、次の行動(問い合わせ・商談予約)まで運ぶための新しい表現アプローチが求められていた。",
  },
  {
    id: "sales-advisor",
    title: "営業顧問マッチング",
    subtitle: "中小企業 × 営業顧問プラットフォーム",
    category: "営業 / HR",
    accent: "#0ea5b7",
    url: "https://d2viqjx04p94di.cloudfront.net/",
    tags: ["顧問マッチング", "中小企業", "業界経験軸"],
    overview:
      "中小企業と営業顧問・外部営業人材をマッチングするプラットフォーム。業界経験・販路・得意先タイプといった軸で検索でき、紹介ベースに依存せず自社に合う営業リソースをデータドリブンで探し出せる。",
    challenge:
      "営業力の弱い中小企業ほど、本来必要なはずの営業顧問や外部営業人材にアクセスできていない。人脈ベースの紹介に偏り、スキルや業界経験でのマッチングが体系化されていないため、出会う前に機会損失が起きている。",
  },
  {
    id: "tkk-rental",
    title: "建機レンタル基幹システム",
    subtitle: "受発注 / 在庫物流 / 営業CRM / 経営BI",
    category: "建設 / 基幹",
    accent: "#7b2ff7",
    url: "https://tkk-rental-app.vercel.app/customers",
    tags: ["受発注ポータル", "CRM", "経営ダッシュボード"],
    overview:
      "建設機械・資機材レンタル業務に特化した統合基幹システム。受発注ポータル・在庫物流最適化・営業支援CRM・経営ダッシュボードの4機能を1プラットフォームに統合し、電話とFAX中心だったレンタル業務を一気にデジタル化する。",
    challenge:
      "建設業全体で人手不足と資材高騰が深刻化する中、建機レンタル業界は大手による業界再編が加速している。従来の「モノを貸すだけ」のビジネスから、デジタルを活用したソリューション提供型へ業態転換することが急務となっていた。",
  },
];

export default function DemoShowcase() {
  const [activeCategory, setActiveCategory] = useState("すべて");

  const categories = ["すべて", ...Array.from(new Set(DEMOS.map((d) => d.category)))];
  const filtered =
    activeCategory === "すべて"
      ? DEMOS
      : DEMOS.filter((d) => d.category === activeCategory);

  const navigateHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          min-height: 100%;
          background: #ffffff;
          color: #1a1f36;
        }
        body {
          font-family: 'Noto Sans JP', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .ds {
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,107,245,0.08), transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 30%, rgba(123,47,247,0.05), transparent 60%),
            #ffffff;
          min-height: 100vh;
        }

        .ds-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 6vw 120px;
        }

        /* ---- NAV ---- */
        .ds-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0 24px;
          margin-bottom: 48px;
          border-bottom: 1px solid rgba(26,31,54,0.08);
        }
        .ds-brand {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #1a1f36;
          font-size: 17px;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .ds-brand:hover { color: #4f6bf5; }

        .ds-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 500;
          color: #4a5578;
          background: #ffffff;
          border: 1px solid rgba(26,31,54,0.12);
          border-radius: 40px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .ds-back:hover {
          color: #1a1f36;
          border-color: #4f6bf5;
          background: rgba(79,107,245,0.05);
          transform: translateX(-2px);
        }

        /* ---- HERO ---- */
        .ds-hero {
          text-align: center;
          margin-bottom: 72px;
        }
        .ds-eyebrow {
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.35em;
          color: #4f6bf5;
          padding: 6px 16px;
          background: rgba(79,107,245,0.08);
          border-radius: 30px;
          margin-bottom: 28px;
        }
        .ds-h1 {
          font-size: clamp(32px, 5.5vw, 56px);
          font-weight: 900;
          line-height: 1.3;
          letter-spacing: 0.01em;
          color: #0d1126;
          margin-bottom: 28px;
        }
        .ds-h1 .ds-h1-accent {
          background: linear-gradient(135deg, #4f6bf5 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ds-lead {
          font-size: clamp(15px, 1.8vw, 18px);
          line-height: 2;
          color: #4a5578;
          max-width: 780px;
          margin: 0 auto 40px;
          font-weight: 400;
        }

        .ds-hero-cta {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ds-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 17px 40px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #ffffff;
          background: linear-gradient(135deg, #4f6bf5, #7b2ff7);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(79,107,245,0.3);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ds-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(79,107,245,0.4);
        }

        .ds-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 17px 36px;
          font-size: 15px;
          font-weight: 600;
          color: #1a1f36;
          background: #ffffff;
          border: 1.5px solid rgba(26,31,54,0.15);
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .ds-btn-ghost:hover {
          border-color: #4f6bf5;
          color: #4f6bf5;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79,107,245,0.15);
        }

        /* ---- FILTER ---- */
        .ds-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 48px;
        }
        .ds-chip {
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 500;
          color: #4a5578;
          background: #ffffff;
          border: 1px solid rgba(26,31,54,0.1);
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ds-chip:hover {
          color: #1a1f36;
          border-color: #4f6bf5;
          background: rgba(79,107,245,0.04);
        }
        .ds-chip.active {
          background: #1a1f36;
          color: #ffffff;
          border-color: #1a1f36;
        }

        /* ---- GRID ---- */
        .ds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .ds-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 32px 30px 28px;
          background: #ffffff;
          border: 1px solid rgba(26,31,54,0.08);
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ds-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--accent, #4f6bf5);
        }
        .ds-card:hover {
          transform: translateY(-4px);
          border-color: rgba(79,107,245,0.3);
          box-shadow: 0 20px 50px rgba(15,23,42,0.1);
        }

        .ds-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .ds-badge {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 6px 12px;
          border-radius: 30px;
          color: var(--accent, #4f6bf5);
          background: color-mix(in srgb, var(--accent, #4f6bf5) 10%, transparent);
          white-space: nowrap;
        }
        .ds-number {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #9ca3b3;
        }

        .ds-card-title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.01em;
          color: #0d1126;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .ds-card-sub {
          font-size: 14px;
          font-weight: 500;
          color: var(--accent, #4f6bf5);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .ds-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .ds-tag {
          font-size: 12px;
          font-weight: 500;
          padding: 5px 11px;
          border-radius: 20px;
          background: #f5f6fa;
          color: #4a5578;
        }

        .ds-section {
          margin-bottom: 18px;
        }
        .ds-section-label {
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #9ca3b3;
          margin-bottom: 8px;
        }
        .ds-section-body {
          font-size: 15px;
          line-height: 1.9;
          color: #2c3447;
          font-weight: 400;
        }
        .ds-challenge {
          padding: 18px 20px;
          background: #fafbfc;
          border-radius: 12px;
          border-left: 3px solid var(--accent, #4f6bf5);
          margin-bottom: 22px;
        }
        .ds-challenge .ds-section-label {
          margin-bottom: 6px;
        }
        .ds-challenge .ds-section-body {
          font-size: 14px;
          color: #4a5578;
          line-height: 1.85;
        }

        .ds-card-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(26,31,54,0.06);
        }
        .ds-card-btn {
          flex: 1;
          min-width: 130px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          background: var(--accent, #4f6bf5);
          border: 1.5px solid var(--accent, #4f6bf5);
          border-radius: 40px;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .ds-card-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent, #4f6bf5) 35%, transparent);
          filter: brightness(1.05);
        }
        .ds-card-btn.secondary {
          background: #ffffff;
          color: var(--accent, #4f6bf5);
        }
        .ds-card-btn.secondary:hover {
          background: color-mix(in srgb, var(--accent, #4f6bf5) 8%, transparent);
        }
        .ds-arrow { transition: transform 0.25s ease; }
        .ds-card-btn:hover .ds-arrow { transform: translateX(3px); }

        /* ---- CLOSING ---- */
        .ds-closing {
          margin: 96px auto 0;
          max-width: 820px;
          text-align: center;
          padding: 60px 40px;
          background: linear-gradient(135deg, #0d1126 0%, #1a1f36 100%);
          border-radius: 28px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }
        .ds-closing::before {
          content: '';
          position: absolute;
          top: -50%; right: -20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(79,107,245,0.35), transparent 70%);
          pointer-events: none;
        }
        .ds-closing::after {
          content: '';
          position: absolute;
          bottom: -50%; left: -10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(123,47,247,0.3), transparent 70%);
          pointer-events: none;
        }
        .ds-closing-inner {
          position: relative;
          z-index: 1;
        }
        .ds-closing-title {
          font-size: clamp(22px, 3.2vw, 30px);
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #ffffff;
          margin-bottom: 16px;
        }
        .ds-closing-text {
          font-size: 15px;
          line-height: 2;
          color: rgba(255,255,255,0.85);
          margin-bottom: 32px;
          font-weight: 400;
        }
        .ds-closing-cta {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .ds-closing .ds-btn-ghost {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          color: #ffffff;
          backdrop-filter: blur(6px);
        }
        .ds-closing .ds-btn-ghost:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.5);
          color: #ffffff;
        }

        .ds-footer {
          margin-top: 64px;
          padding-top: 28px;
          border-top: 1px solid rgba(26,31,54,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #9ca3b3;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 720px) {
          .ds-container { padding: 24px 5vw 80px; }
          .ds-nav { margin-bottom: 32px; }
          .ds-hero { margin-bottom: 48px; }
          .ds-grid { grid-template-columns: 1fr; gap: 18px; }
          .ds-card { padding: 26px 22px 22px; }
          .ds-card-title { font-size: 21px; }
          .ds-section-body { font-size: 14px; }
          .ds-closing { padding: 44px 24px; margin-top: 64px; }
          .ds-footer { flex-direction: column; gap: 8px; text-align: center; }
          .ds-btn-primary, .ds-btn-ghost { padding: 15px 28px; font-size: 14px; }
        }
      `}</style>

      <div className="ds">
        <div className="ds-container">
          <nav className="ds-nav">
            <button className="ds-brand" onClick={navigateHome}>SOPHIATE</button>
            <a className="ds-back" href="/" onClick={navigateHome}>
              <span aria-hidden="true">&#8592;</span>
              トップへ戻る
            </a>
          </nav>

          <section className="ds-hero">
            <span className="ds-eyebrow">DEMO &middot; CASE STUDIES</span>
            <h1 className="ds-h1">
              営業現場で磨いた、<br />
              <span className="ds-h1-accent">業界課題×プロダクト</span>の実例。
            </h1>
            <p className="ds-lead">
              ソフィエイトが実際の営業活動の中で設計・構築し、クライアント課題の検証に使ってきたプロダクトデモ・事例を公開しています。
              建設・介護・教育・HR・営業など、業界ごとの「実際に困っていること」を起点に、伴走型でプロダクトを共創しています。
            </p>
            <div className="ds-hero-cta">
              <a
                className="ds-btn-primary"
                href={SERVICE_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-hidden="true">&#128196;</span>
                サービス資料を見る
              </a>
              <a
                className="ds-btn-ghost"
                href="mailto:info@sophiate.co.jp"
              >
                <span aria-hidden="true">&#9993;</span>
                お問い合わせ
              </a>
            </div>
          </section>

          <div className="ds-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`ds-chip ${activeCategory === c ? "active" : ""}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="ds-grid">
            {filtered.map((d) => (
              <article
                key={d.id}
                className="ds-card"
                style={{ "--accent": d.accent }}
              >
                <div className="ds-card-head">
                  <span className="ds-badge">{d.category}</span>
                  <span className="ds-number">CASE / {String(DEMOS.indexOf(d) + 1).padStart(2, "0")}</span>
                </div>

                <h2 className="ds-card-title">{d.title}</h2>
                <div className="ds-card-sub">{d.subtitle}</div>

                <div className="ds-tags">
                  {d.tags.map((t) => (
                    <span key={t} className="ds-tag">#{t}</span>
                  ))}
                </div>

                <div className="ds-section">
                  <span className="ds-section-label">OVERVIEW / 概要</span>
                  <p className="ds-section-body">{d.overview}</p>
                </div>

                <div className="ds-challenge">
                  <span className="ds-section-label">CHALLENGE / 業界課題</span>
                  <p className="ds-section-body">{d.challenge}</p>
                </div>

                <div className="ds-card-footer">
                  <a
                    className="ds-card-btn"
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    デモを見る
                    <span className="ds-arrow" aria-hidden="true">&rarr;</span>
                  </a>
                  {d.secondaryUrl && (
                    <a
                      className="ds-card-btn secondary"
                      href={d.secondaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {d.secondaryLabel}
                      <span className="ds-arrow" aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <section className="ds-closing">
            <div className="ds-closing-inner">
              <h3 className="ds-closing-title">貴社の業界課題に、伴走します。</h3>
              <p className="ds-closing-text">
                ここに並ぶデモはすべて、クライアント・ヒアリングから生まれた「現場の痛み」を起点に設計しました。<br />
                企画段階から参加し、プロダクトで検証まで持ち込みます。気になるテーマがあれば、お気軽にお問い合わせください。
              </p>
              <div className="ds-closing-cta">
                <a
                  className="ds-btn-primary"
                  href={SERVICE_DOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">&#128196;</span>
                  サービス資料を見る
                </a>
                <a
                  className="ds-btn-ghost"
                  href="mailto:info@sophiate.co.jp"
                >
                  <span aria-hidden="true">&#9993;</span>
                  お問い合わせ
                </a>
              </div>
            </div>
          </section>

          <footer className="ds-footer">
            <span>© Sophiate Inc.</span>
            <span>SOPHIATE &middot; DEMO GALLERY</span>
          </footer>
        </div>
      </div>
    </>
  );
}
