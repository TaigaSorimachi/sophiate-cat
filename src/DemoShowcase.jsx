import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BRAND_BLUE = 0x6b7ff5;
const BRAND_CYAN = 0x7be0f5;
const BRAND_PURPLE = 0x7b2ff7;

const SERVICE_DOC_URL =
  "https://drive.google.com/file/d/1MBBVGYKNeoR6N62pnY1iZTr1YrrteF9h/view?usp=sharing";

const DEMOS = [
  {
    id: "kanemiel",
    title: "カネミエル",
    subtitle: "建設業向けキャッシュフロー見える化",
    category: "建設 / 財務",
    accent: "#6b7ff5",
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
    accent: "#7be0f5",
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
    accent: "#6b7ff5",
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
    accent: "#7be0f5",
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
    accent: "#6b7ff5",
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
    accent: "#7be0f5",
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
  const mountRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("すべて");

  const categories = ["すべて", ...Array.from(new Set(DEMOS.map((d) => d.category)))];
  const filtered =
    activeCategory === "すべて"
      ? DEMOS
      : DEMOS.filter((d) => d.category === activeCategory);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 6000);
    camera.position.set(0, 0, 600);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020208, 1);
    el.appendChild(renderer.domElement);

    const starCount = 1800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 400 + Math.random() * 2500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const palette = [BRAND_BLUE, BRAND_CYAN, BRAND_PURPLE];
      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      c.multiplyScalar(0.35 + Math.random() * 0.4);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.02;
      points.rotation.x = Math.sin(t * 0.05) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  const navigateHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #020208; color: #fff; min-height: 100%; overflow-x: hidden; }
        body { font-family: 'Noto Sans JP', sans-serif; }

        .ds-bg {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh; z-index: 0;
        }
        .ds-bg canvas {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh;
        }

        .ds-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          padding: 80px 6vw 120px;
          background: radial-gradient(ellipse at 20% 0%, rgba(107,127,245,0.08), transparent 50%),
                      radial-gradient(ellipse at 80% 100%, rgba(123,47,247,0.08), transparent 50%);
        }

        .ds-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto 60px;
        }
        .ds-brand {
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: #fff;
          font-size: 18px;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .ds-brand:hover { color: #7be0f5; }

        .ds-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          font-size: 13px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(107,127,245,0.25);
          border-radius: 40px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .ds-back:hover {
          color: #fff;
          background: rgba(107,127,245,0.15);
          border-color: rgba(107,127,245,0.6);
          transform: translateX(-3px);
        }

        /* ---- HERO ---- */
        .ds-hero {
          max-width: 1100px;
          margin: 0 auto 60px;
          text-align: center;
        }
        .ds-eyebrow {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          letter-spacing: 0.5em;
          color: rgba(123,224,245,0.8);
          margin-bottom: 22px;
        }
        .ds-h1 {
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 5vw, 52px);
          line-height: 1.3;
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #fff 0%, #9bb2ff 50%, #7be0f5 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 26px;
        }
        .ds-lead {
          font-size: clamp(14px, 1.8vw, 17px);
          line-height: 2;
          color: rgba(255,255,255,0.75);
          max-width: 780px;
          margin: 0 auto 44px;
          font-weight: 300;
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
          padding: 18px 44px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          background: linear-gradient(135deg, #6b7ff5, #7b2ff7);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 0 30px rgba(107,127,245,0.35),
                      0 0 60px rgba(123,47,247,0.2);
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .ds-btn-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 50px rgba(107,127,245,0.55),
                      0 0 100px rgba(123,47,247,0.35);
        }

        .ds-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(107,127,245,0.35);
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: all 0.35s ease;
        }
        .ds-btn-ghost:hover {
          background: rgba(107,127,245,0.15);
          border-color: rgba(107,127,245,0.7);
          color: #fff;
          transform: translateY(-3px);
        }

        /* ---- FILTER ---- */
        .ds-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 1100px;
          margin: 0 auto 48px;
        }
        .ds-chip {
          padding: 9px 20px;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .ds-chip:hover {
          color: #fff;
          border-color: rgba(107,127,245,0.5);
        }
        .ds-chip.active {
          background: linear-gradient(135deg, rgba(107,127,245,0.35), rgba(123,47,247,0.3));
          border-color: rgba(123,224,245,0.6);
          color: #fff;
          box-shadow: 0 0 20px rgba(107,127,245,0.25);
        }

        /* ---- GRID ---- */
        .ds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 26px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .ds-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 30px 28px 28px;
          background: linear-gradient(160deg, rgba(22,24,45,0.75), rgba(12,13,28,0.85));
          border: 1px solid rgba(107,127,245,0.18);
          border-radius: 20px;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ds-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent, #6b7ff5);
          opacity: 0.7;
        }
        .ds-card::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, transparent, var(--accent, #6b7ff5), transparent);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .ds-card:hover {
          transform: translateY(-6px);
          border-color: rgba(107,127,245,0.4);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5),
                      0 0 40px rgba(107,127,245,0.15);
        }
        .ds-card:hover::after { opacity: 1; }

        .ds-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
        }
        .ds-badge {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          padding: 6px 12px;
          border-radius: 30px;
          color: var(--accent, #6b7ff5);
          background: rgba(255,255,255,0.04);
          border: 1px solid currentColor;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ds-number {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.3);
        }

        .ds-card-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fff;
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .ds-card-sub {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--accent, #6b7ff5);
          font-weight: 500;
          margin-bottom: 20px;
        }

        .ds-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .ds-tag {
          font-size: 10.5px;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
        }

        .ds-section {
          margin-bottom: 16px;
        }
        .ds-section-label {
          display: inline-block;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--accent, #6b7ff5);
          margin-bottom: 7px;
          opacity: 0.9;
        }
        .ds-section-body {
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255,255,255,0.78);
          font-weight: 300;
        }
        .ds-challenge .ds-section-body {
          color: rgba(255,255,255,0.65);
        }

        .ds-card-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ds-card-btn {
          flex: 1;
          min-width: 130px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 18px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #fff;
          background: linear-gradient(135deg, rgba(107,127,245,0.25), rgba(123,47,247,0.2));
          border: 1px solid rgba(107,127,245,0.4);
          border-radius: 40px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .ds-card-btn:hover {
          background: linear-gradient(135deg, rgba(107,127,245,0.5), rgba(123,47,247,0.45));
          border-color: rgba(123,224,245,0.8);
          transform: translateY(-1px);
        }
        .ds-card-btn.secondary {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8);
        }
        .ds-card-btn.secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
        .ds-arrow { transition: transform 0.3s ease; }
        .ds-card-btn:hover .ds-arrow { transform: translateX(3px); }

        /* ---- CLOSING ---- */
        .ds-closing {
          max-width: 820px;
          margin: 100px auto 0;
          text-align: center;
          padding: 50px 36px;
          background: linear-gradient(135deg, rgba(107,127,245,0.08), rgba(123,47,247,0.05));
          border: 1px solid rgba(107,127,245,0.2);
          border-radius: 28px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .ds-closing-title {
          font-size: clamp(20px, 3.2vw, 28px);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          margin-bottom: 14px;
        }
        .ds-closing-text {
          font-size: 14px;
          line-height: 2;
          color: rgba(255,255,255,0.7);
          margin-bottom: 30px;
          font-weight: 300;
        }
        .ds-closing-cta {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ds-footer {
          max-width: 1280px;
          margin: 80px auto 0;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.3);
        }

        @media (max-width: 720px) {
          .ds-page { padding: 40px 5vw 90px; }
          .ds-nav { margin-bottom: 40px; }
          .ds-grid { grid-template-columns: 1fr; }
          .ds-card { padding: 26px 22px 22px; }
          .ds-closing { padding: 36px 22px; }
          .ds-footer { flex-direction: column; gap: 8px; }
        }
      `}</style>

      <div ref={mountRef} className="ds-bg" />

      <div className="ds-page">
        <div className="ds-nav">
          <button className="ds-brand" onClick={navigateHome}>SOPHIATE</button>
          <a className="ds-back" href="/" onClick={navigateHome}>
            <span aria-hidden="true">&#8592;</span>
            トップへ戻る
          </a>
        </div>

        <section className="ds-hero">
          <div className="ds-eyebrow">DEMO &middot; CASE STUDIES</div>
          <h1 className="ds-h1">営業現場で磨いた、<br />業界課題×プロダクトの実例。</h1>
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
          {filtered.map((d, i) => (
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

              <div className="ds-section ds-challenge">
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
          <h3 className="ds-closing-title">貴社の業界課題に、伴走します。</h3>
          <p className="ds-closing-text">
            ここに並ぶデモはすべて、クライアント・ヒアリングから生まれた「現場の痛み」を起点に設計しました。
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
              href="https://reachup.mf-hd.com/link/tnqjctn5wxr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">&#128101;</span>
              決済者直アポを取る
            </a>
          </div>
        </section>

        <footer className="ds-footer">
          <span>© Sophiate Inc.</span>
          <span>SOPHIATE &middot; DEMO GALLERY</span>
        </footer>
      </div>
    </>
  );
}
