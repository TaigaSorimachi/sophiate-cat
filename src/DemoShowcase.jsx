import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SERVICE_DOC_URL =
  "https://drive.google.com/file/d/1MBBVGYKNeoR6N62pnY1iZTr1YrrteF9h/view?usp=sharing";
const CONTACT_URL = "https://sophiate.co.jp/contact/";
const ESTIMATE_URL = "https://estimate.sophiate.co.jp/";

const INDUSTRIES = {
  construction: {
    key: "construction",
    name: "建設・インフラ",
    nameEn: "CONSTRUCTION",
    color: "#f97316",
    colorSoft: "#fff3e8",
    colorMid: "#fb923c",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
        <path d="M8 42h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 42V20l9-4 9 4v22" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M30 42V14l8 3v25" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 30h4M18 24h4M34 28h2M34 22h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    tagline: "現場・資金・人の流れを、デジタルで結びなおす",
  },
  nursing: {
    key: "nursing",
    name: "介護・ヘルスケア",
    nameEn: "NURSING & CARE",
    color: "#10b981",
    colorSoft: "#e6f7f1",
    colorMid: "#34d399",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
        <path d="M24 40c-8-6-14-11-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 8-6 13-14 19z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 18v10M19 23h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    tagline: "人が人を支える仕事を、システムが支える",
  },
  education: {
    key: "education",
    name: "教育・スクール",
    nameEn: "EDUCATION",
    color: "#7b2ff7",
    colorSoft: "#f2e9fd",
    colorMid: "#9b6dfa",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
        <path d="M4 18l20-8 20 8-20 8-20-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M12 22v10c0 3 5 6 12 6s12-3 12-6V22" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M40 20v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    tagline: "学びを続けさせる、スクール運営の土台",
  },
  hr: {
    key: "hr",
    name: "人材・HR",
    nameEn: "HR & TALENT",
    color: "#0ea5b7",
    colorSoft: "#e0f5f8",
    colorMid: "#38bdd0",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
        <circle cx="18" cy="18" r="6" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="34" cy="20" r="5" stroke="currentColor" strokeWidth="2.5" />
        <path d="M6 38c0-6 6-10 12-10s12 4 12 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 28c5 0 14 3 14 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    tagline: "人の強みを、データで見える化する",
  },
  sales: {
    key: "sales",
    name: "営業・マーケティング",
    nameEn: "SALES & MARKETING",
    color: "#4f6bf5",
    colorSoft: "#ecefff",
    colorMid: "#7189f7",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
        <path d="M6 38h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M6 38L18 22l8 7 16-17" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M34 12h8v8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
    tagline: "営業の勝ちパターンを、プロダクトで量産する",
  },
};

const DEMOS = [
  {
    id: "kanemiel",
    industry: "construction",
    title: "カネミエル",
    subtitle: "建設業向けキャッシュフロー見える化",
    url: "https://taigasorimachi.github.io/kanemiel/",
    tags: ["現場別残高", "支払承認", "資金繰り予測"],
    overview:
      "建設業の資金管理をワンストップで実現するダッシュボード。現場ごとの残高・支払承認フロー・将来の資金繰り予測をリアルタイムに可視化し、経営者が現場単位の収支と会社全体のキャッシュ状況を同じ画面で把握できる。",
    challenge:
      "建設業は着工から入金までのサイクルが長く、複数現場の収支がバラバラに管理されるため資金ショートに気づくのが遅れやすい。現状はExcelと担当者の勘に依存しており、経営者がリアルタイムに判断できる手段が存在しない。",
  },
  {
    id: "site-report",
    industry: "construction",
    title: "現場日報 & マッチング",
    subtitle: "管理者ダッシュボード + 現場ユーザー入力",
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
    id: "tkk-rental",
    industry: "construction",
    title: "建機レンタル基幹システム",
    subtitle: "受発注 / 在庫物流 / 営業CRM / 経営BI",
    url: "https://tkk-rental-app.vercel.app/customers",
    tags: ["受発注ポータル", "CRM", "経営ダッシュボード"],
    overview:
      "建設機械・資機材レンタル業務に特化した統合基幹システム。受発注ポータル・在庫物流最適化・営業支援CRM・経営ダッシュボードの4機能を1プラットフォームに統合し、電話とFAX中心だったレンタル業務を一気にデジタル化する。",
    challenge:
      "建設業全体で人手不足と資材高騰が深刻化する中、建機レンタル業界は大手による業界再編が加速している。従来の「モノを貸すだけ」のビジネスから、デジタルを活用したソリューション提供型へ業態転換することが急務となっていた。",
  },
  {
    id: "nursing-shift",
    industry: "nursing",
    title: "介護シフト自動生成",
    subtitle: "18名×31日を2秒で組むシフト最適化",
    url: "https://nursing-shift-generator.vercel.app/",
    tags: ["希望休考慮", "資格・相性", "労基適合"],
    overview:
      "介護施設のシフト作成を自動化するWebアプリ。職員の希望休・保有資格・相性・労働基準法上の制約を考慮しながら、18名×31日のシフトを2秒以内に生成。自動生成結果/本人希望/管理者調整を3層で並べ表示し、配置基準の充足率とワークロードバランスをリアルタイム監視できる。",
    challenge:
      "シフト作成は月25時間を要する職場も多く、法令と相性・希望休を同時に満たすのは属人的な職人技になっていた。急な欠員や希望変更への対応にも時間がかかり、作成担当者が疲弊しているケースが多い。",
  },
  {
    id: "elearning-lms",
    industry: "education",
    title: "スクール特化LMS",
    subtitle: "Admin / Teacher / Student 3ロールLMS",
    url: "https://demo-elearning-ebon.vercel.app/",
    tags: ["動画学習", "課題管理", "KPI分析"],
    overview:
      "小〜中規模スクール運営に特化したLMS。Admin/Teacher/Studentの3ロール構成で、動画学習・課題管理・KPI分析までを一貫で提供。受講進捗・離脱兆候・課題提出状況を運営者視点で俯瞰でき、スクール運営実務にフィットした導線で設計されている。",
    challenge:
      "中小規模のスクールには、大手向けの高額なLMS SaaS か、機能不足の汎用ツールの組み合わせという二択しかなかった。生徒の進捗把握や離脱防止が手作業になりやすく、運営担当者の時間がオペレーション業務に奪われている。",
  },
  {
    id: "engineer-assessment",
    industry: "hr",
    title: "エンジニア診断",
    subtitle: "スキル・特性をプロファイリング",
    url: "https://engineer-assessment-sigma.vercel.app/",
    tags: ["スキル可視化", "適性診断", "採用・編成"],
    overview:
      "エンジニアのスキルと特性をプロファイリングする診断ツール。経験領域・得意技術・思考スタイル・チーム内での役割傾向を複数軸で可視化し、採用判断やチームアサインの意思決定を支える客観データを提供する。",
    challenge:
      "エンジニア採用やチーム編成では、面談の印象や自己申告に頼る評価が横行している。スキルと適性を客観的に可視化する共通指標がないため、ミスマッチや期待ズレが頻発し、採用コストと離職リスクを押し上げている。",
  },
  {
    id: "itpm-mbti",
    industry: "hr",
    title: "IT PM MBTI診断",
    subtitle: "開発PMのタイプ・レベル診断",
    url: "https://itpm-mbti.vercel.app/",
    tags: ["PM診断", "タイプ分類", "育成計画"],
    overview:
      "開発プロジェクトマネージャーのタイプとレベルを診断するツール。コミュニケーション・リスク管理・要件整理・チームビルディングなど複数観点からPMの強みと伸びしろを可視化し、案件アサインと育成計画の判断材料にする。",
    challenge:
      "PMの力量差はプロジェクトの成否を大きく左右するにもかかわらず、評価基準が属人的で数値化されていない。定量的なPM把握手段がないため、適切なアサインも育成計画も立てにくい状態が続いている。",
  },
  {
    id: "sophiate-cta",
    industry: "sales",
    title: "3D CTAランディング",
    subtitle: "インパクトメール用の没入型LP",
    url: "https://sophiate-cta.vercel.app/",
    tags: ["Three.js", "営業メール", "CVR改善"],
    overview:
      "営業メールに添付するインパクト用ランディングページ。3Dアニメーションの銀河ビジュアル上にコーポレートメッセージとCTAを配置し、メール開封後のユーザーを視覚体験で引き込みながらコンバージョン動線へ誘導する。",
    challenge:
      "営業メールの開封後CVRは極めて低く、テキストと画像だけでは他社と差別化できない。受信者の関心を一瞬で掴み、次の行動(問い合わせ・商談予約)まで運ぶための新しい表現アプローチが求められていた。",
  },
  {
    id: "sales-advisor",
    industry: "sales",
    title: "営業顧問マッチング",
    subtitle: "中小企業 × 営業顧問プラットフォーム",
    url: "https://d2viqjx04p94di.cloudfront.net/",
    tags: ["顧問マッチング", "中小企業", "業界経験軸"],
    overview:
      "中小企業と営業顧問・外部営業人材をマッチングするプラットフォーム。業界経験・販路・得意先タイプといった軸で検索でき、紹介ベースに依存せず自社に合う営業リソースをデータドリブンで探し出せる。",
    challenge:
      "営業力の弱い中小企業ほど、本来必要なはずの営業顧問や外部営業人材にアクセスできていない。人脈ベースの紹介に偏り、スキルや業界経験でのマッチングが体系化されていないため、出会う前に機会損失が起きている。",
  },
];

const INDUSTRY_ORDER = ["construction", "nursing", "education", "hr", "sales"];

function GeometricBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 2000);
    camera.position.set(0, 0, 420);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0);
    el.appendChild(renderer.domElement);

    const dotCount = 240;
    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);
    const palette = [
      new THREE.Color(0x4f6bf5),
      new THREE.Color(0x7b2ff7),
      new THREE.Color(0x0ea5b7),
      new THREE.Color(0xf97316),
      new THREE.Color(0x10b981),
    ];
    for (let i = 0; i < dotCount; i++) {
      const r = 80 + Math.random() * 520;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dotPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      dotPos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      dotColors[i * 3] = c.r;
      dotColors[i * 3 + 1] = c.g;
      dotColors[i * 3 + 2] = c.b;
    }
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    const dotMat = new THREE.PointsMaterial({
      size: 3.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    const linePositions = [];
    for (let i = 0; i < dotCount; i++) {
      for (let j = i + 1; j < dotCount; j++) {
        const dx = dotPos[i * 3] - dotPos[j * 3];
        const dy = dotPos[i * 3 + 1] - dotPos[j * 3 + 1];
        const dz = dotPos[i * 3 + 2] - dotPos[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 95 && Math.random() > 0.55) {
          linePositions.push(
            dotPos[i * 3], dotPos[i * 3 + 1], dotPos[i * 3 + 2],
            dotPos[j * 3], dotPos[j * 3 + 1], dotPos[j * 3 + 2]
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f6bf5,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const rings = [];
    const ringSpecs = [
      { r: 180, color: 0x4f6bf5, rx: 0.2, ry: 0, rz: 0.3, speed: 0.08 },
      { r: 260, color: 0x7b2ff7, rx: -0.35, ry: 0.2, rz: 0.6, speed: -0.05 },
      { r: 340, color: 0x0ea5b7, rx: 0.1, ry: -0.3, rz: -0.4, speed: 0.04 },
    ];
    ringSpecs.forEach((s) => {
      const geo = new THREE.TorusGeometry(s.r, 0.4, 8, 180);
      const mat = new THREE.MeshBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.12,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.set(s.rx, s.ry, s.rz);
      scene.add(ring);
      rings.push({ ring, speed: s.speed });
    });

    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      dots.rotation.y = t * 0.02;
      dots.rotation.x = Math.sin(t * 0.1) * 0.08;
      lines.rotation.y = t * 0.02;
      lines.rotation.x = Math.sin(t * 0.1) * 0.08;
      rings.forEach((r) => {
        r.ring.rotation.z += r.speed * 0.01;
      });
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
      dotGeo.dispose();
      dotMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      rings.forEach((r) => { r.ring.geometry.dispose(); r.ring.material.dispose(); });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="ds-geo" aria-hidden="true" />;
}

export default function DemoShowcase() {
  const [activeIndustry, setActiveIndustry] = useState("all");

  const filtered =
    activeIndustry === "all"
      ? DEMOS
      : DEMOS.filter((d) => d.industry === activeIndustry);

  const grouped = INDUSTRY_ORDER.map((key) => ({
    industry: INDUSTRIES[key],
    demos: filtered.filter((d) => d.industry === key),
  })).filter((g) => g.demos.length > 0);

  const navigateHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          min-height: 100%;
          background: #fafbff;
          color: #0d1126;
        }
        body {
          font-family: 'Noto Sans JP', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .ds-geo {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
        }
        .ds-geo canvas {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
        }
        .ds-grid-bg {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(13,17,38,0.09) 1px, transparent 0);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 85%);
          opacity: 0.65;
        }

        .ds {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(79,107,245,0.07), transparent 70%),
            radial-gradient(ellipse 50% 30% at 85% 30%, rgba(123,47,247,0.05), transparent 70%);
        }

        .ds-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 32px 6vw 120px;
        }

        .ds-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          margin-bottom: 56px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(26,31,54,0.08);
          border-radius: 50px;
          box-shadow: 0 2px 16px rgba(13,17,38,0.04);
        }
        .ds-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          letter-spacing: 0.22em;
          color: #0d1126;
          font-size: 16px;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .ds-brand::before {
          content: '';
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f6bf5, #7b2ff7);
          box-shadow: 0 0 12px rgba(79,107,245,0.5);
        }
        .ds-brand:hover { color: #4f6bf5; }

        .ds-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5578;
          background: transparent;
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

        .ds-hero {
          text-align: center;
          margin-bottom: 80px;
          padding: 40px 0 20px;
        }
        .ds-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #4f6bf5;
          padding: 8px 20px;
          background: rgba(79,107,245,0.08);
          border: 1px solid rgba(79,107,245,0.2);
          border-radius: 30px;
          margin-bottom: 32px;
        }
        .ds-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4f6bf5;
          box-shadow: 0 0 0 3px rgba(79,107,245,0.2);
        }
        .ds-h1 {
          font-size: clamp(34px, 6vw, 64px);
          font-weight: 900;
          line-height: 1.25;
          letter-spacing: 0.01em;
          color: #0d1126;
          margin-bottom: 28px;
        }
        .ds-h1 .ds-h1-accent {
          background: linear-gradient(135deg, #4f6bf5 0%, #7b2ff7 60%, #0ea5b7 100%);
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
          box-shadow: 0 12px 32px rgba(79,107,245,0.3);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ds-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px rgba(79,107,245,0.42);
        }

        .ds-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 17px 36px;
          font-size: 15px;
          font-weight: 600;
          color: #0d1126;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(26,31,54,0.15);
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .ds-btn-ghost:hover {
          border-color: #4f6bf5;
          color: #4f6bf5;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79,107,245,0.15);
        }

        .ds-industry-bar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 72px;
        }
        .ds-industry-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5578;
          background: rgba(255,255,255,0.85);
          border: 1.5px solid rgba(26,31,54,0.1);
          border-radius: 40px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }
        .ds-industry-chip:hover {
          color: #0d1126;
          border-color: var(--ind-color, #4f6bf5);
          background: #ffffff;
          transform: translateY(-1px);
        }
        .ds-industry-chip.active {
          background: var(--ind-color, #0d1126);
          color: #ffffff;
          border-color: var(--ind-color, #0d1126);
          box-shadow: 0 6px 20px color-mix(in srgb, var(--ind-color, #0d1126) 30%, transparent);
        }
        .ds-industry-chip .ds-chip-icon {
          display: inline-flex;
          width: 18px;
          height: 18px;
          color: var(--ind-color, #4f6bf5);
        }
        .ds-industry-chip .ds-chip-icon svg { width: 18px; height: 18px; }
        .ds-industry-chip.active .ds-chip-icon { color: #ffffff; }
        .ds-industry-chip .ds-chip-count {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          background: rgba(13,17,38,0.08);
          border-radius: 20px;
          color: inherit;
          margin-left: 2px;
        }
        .ds-industry-chip.active .ds-chip-count {
          background: rgba(255,255,255,0.2);
        }

        .ds-section {
          margin-bottom: 80px;
        }
        .ds-section-head {
          position: relative;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px 32px;
          margin-bottom: 28px;
          background: linear-gradient(135deg, var(--ind-soft), #ffffff 80%);
          border: 1px solid color-mix(in srgb, var(--ind-color) 25%, transparent);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px color-mix(in srgb, var(--ind-color) 10%, transparent);
        }
        .ds-section-head::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 6px;
          background: var(--ind-color);
        }
        .ds-section-head::after {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, color-mix(in srgb, var(--ind-color) 20%, transparent), transparent 70%);
          pointer-events: none;
        }
        .ds-section-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: #ffffff;
          color: var(--ind-color);
          box-shadow: 0 10px 28px color-mix(in srgb, var(--ind-color) 25%, transparent);
          border: 1px solid color-mix(in srgb, var(--ind-color) 30%, transparent);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .ds-section-text {
          flex: 1;
          min-width: 0;
          position: relative;
          z-index: 1;
        }
        .ds-section-en {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: var(--ind-color);
          margin-bottom: 4px;
        }
        .ds-section-name {
          font-size: clamp(24px, 3.2vw, 30px);
          font-weight: 900;
          letter-spacing: 0.02em;
          color: #0d1126;
          line-height: 1.3;
          margin-bottom: 6px;
        }
        .ds-section-tagline {
          font-size: 14px;
          font-weight: 500;
          color: #4a5578;
          line-height: 1.6;
        }
        .ds-section-count {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 800;
          padding: 8px 18px;
          color: var(--ind-color);
          background: #ffffff;
          border: 1.5px solid var(--ind-color);
          border-radius: 30px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          white-space: nowrap;
          letter-spacing: 0.1em;
        }

        .ds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .ds-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid rgba(26,31,54,0.08);
          border-radius: 22px;
          box-shadow: 0 4px 16px rgba(13,17,38,0.04);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ds-card:hover {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--ind-color, #4f6bf5) 35%, transparent);
          box-shadow: 0 24px 56px rgba(13,17,38,0.1);
        }

        .ds-card-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 22px;
          background: linear-gradient(90deg, var(--ind-color), var(--ind-mid));
          color: #ffffff;
        }
        .ds-card-ribbon-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ds-card-ribbon-icon {
          display: inline-flex;
          width: 22px;
          height: 22px;
          color: #ffffff;
        }
        .ds-card-ribbon-icon svg { width: 22px; height: 22px; }
        .ds-card-ribbon-text {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }
        .ds-card-ribbon-number {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          opacity: 0.85;
        }

        .ds-card-body {
          padding: 26px 28px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ds-card-title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.01em;
          color: #0d1126;
          margin-bottom: 8px;
          line-height: 1.35;
        }
        .ds-card-sub {
          font-size: 14px;
          font-weight: 600;
          color: var(--ind-color, #4f6bf5);
          margin-bottom: 18px;
          line-height: 1.5;
        }

        .ds-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .ds-tag {
          font-size: 12px;
          font-weight: 500;
          padding: 5px 11px;
          border-radius: 20px;
          background: #f5f6fa;
          color: #4a5578;
        }

        .ds-block {
          margin-bottom: 18px;
        }
        .ds-block-label {
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #9ca3b3;
          margin-bottom: 8px;
        }
        .ds-block-body {
          font-size: 14.5px;
          line-height: 1.9;
          color: #2c3447;
          font-weight: 400;
        }
        .ds-challenge {
          padding: 16px 18px;
          background: var(--ind-soft, #fafbfc);
          border-radius: 12px;
          border-left: 3px solid var(--ind-color, #4f6bf5);
          margin-bottom: 22px;
        }
        .ds-challenge .ds-block-label {
          margin-bottom: 6px;
          color: var(--ind-color, #9ca3b3);
        }
        .ds-challenge .ds-block-body {
          font-size: 13.5px;
          color: #3a4463;
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
          background: var(--ind-color, #4f6bf5);
          border: 1.5px solid var(--ind-color, #4f6bf5);
          border-radius: 40px;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .ds-card-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px color-mix(in srgb, var(--ind-color, #4f6bf5) 40%, transparent);
          filter: brightness(1.06);
        }
        .ds-card-btn.secondary {
          background: #ffffff;
          color: var(--ind-color, #4f6bf5);
        }
        .ds-card-btn.secondary:hover {
          background: color-mix(in srgb, var(--ind-color, #4f6bf5) 8%, transparent);
        }
        .ds-arrow { transition: transform 0.25s ease; }
        .ds-card-btn:hover .ds-arrow { transform: translateX(3px); }

        .ds-closing {
          margin: 100px auto 0;
          max-width: 860px;
          text-align: center;
          padding: 64px 44px;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(79,107,245,0.38), transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(123,47,247,0.3), transparent 60%),
            linear-gradient(135deg, #0d1126 0%, #1a1f36 100%);
          border-radius: 32px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(13,17,38,0.2);
        }
        .ds-closing-inner { position: relative; z-index: 1; }
        .ds-closing-title {
          font-size: clamp(24px, 3.4vw, 32px);
          font-weight: 900;
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
          border-color: rgba(255,255,255,0.28);
          color: #ffffff;
        }
        .ds-closing .ds-btn-ghost:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.6);
          color: #ffffff;
        }

        .ds-footer {
          margin-top: 72px;
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
          .ds-container { padding: 20px 5vw 80px; }
          .ds-nav { margin-bottom: 32px; padding: 10px 16px; }
          .ds-hero { margin-bottom: 48px; padding: 20px 0 10px; }
          .ds-industry-bar { margin-bottom: 48px; }
          .ds-section { margin-bottom: 56px; }
          .ds-section-head { padding: 20px 22px; gap: 16px; border-radius: 18px; flex-wrap: wrap; }
          .ds-section-icon { width: 52px; height: 52px; border-radius: 16px; }
          .ds-section-icon svg { width: 24px; height: 24px; }
          .ds-section-count { order: 3; width: 100%; text-align: center; }
          .ds-grid { grid-template-columns: 1fr; gap: 18px; }
          .ds-card-body { padding: 22px 22px 22px; }
          .ds-card-title { font-size: 20px; }
          .ds-block-body { font-size: 14px; }
          .ds-closing { padding: 44px 24px; margin-top: 64px; }
          .ds-footer { flex-direction: column; gap: 8px; text-align: center; }
          .ds-btn-primary, .ds-btn-ghost { padding: 14px 26px; font-size: 14px; }
        }
      `}</style>

      <GeometricBackground />
      <div className="ds-grid-bg" />

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
              業界の「現場の痛み」を、<br />
              <span className="ds-h1-accent">プロダクトで解く</span>。
            </h1>
            <p className="ds-lead">
              ソフィエイトが営業活動の中で設計・構築してきたデモと事例を、業界別にまとめています。
              建設・介護・教育・人材・営業 —— それぞれの「現場でしか気づけない痛み」を起点に、
              企画段階から伴走してプロダクトで検証します。
            </p>
            <div className="ds-hero-cta">
              <a
                className="ds-btn-primary"
                href={SERVICE_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-hidden="true">&#128196;</span>
                業務改善カタログを見る
              </a>
              <a
                className="ds-btn-ghost"
                href={ESTIMATE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-hidden="true">&#128176;</span>
                自動見積もり
              </a>
              <a
                className="ds-btn-ghost"
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-hidden="true">&#9993;</span>
                お問い合わせ
              </a>
            </div>
          </section>

          <div className="ds-industry-bar">
            <button
              className={`ds-industry-chip ${activeIndustry === "all" ? "active" : ""}`}
              style={{ "--ind-color": "#0d1126" }}
              onClick={() => setActiveIndustry("all")}
            >
              すべての業界
              <span className="ds-chip-count">{DEMOS.length}</span>
            </button>
            {INDUSTRY_ORDER.map((key) => {
              const ind = INDUSTRIES[key];
              const count = DEMOS.filter((d) => d.industry === key).length;
              return (
                <button
                  key={key}
                  className={`ds-industry-chip ${activeIndustry === key ? "active" : ""}`}
                  style={{ "--ind-color": ind.color }}
                  onClick={() => setActiveIndustry(key)}
                >
                  <span className="ds-chip-icon">{ind.icon}</span>
                  {ind.name}
                  <span className="ds-chip-count">{count}</span>
                </button>
              );
            })}
          </div>

          {grouped.map(({ industry, demos }) => (
            <section
              key={industry.key}
              className="ds-section"
              style={{
                "--ind-color": industry.color,
                "--ind-soft": industry.colorSoft,
                "--ind-mid": industry.colorMid,
              }}
            >
              <header className="ds-section-head">
                <div className="ds-section-icon">{industry.icon}</div>
                <div className="ds-section-text">
                  <div className="ds-section-en">{industry.nameEn}</div>
                  <h2 className="ds-section-name">{industry.name}</h2>
                  <p className="ds-section-tagline">{industry.tagline}</p>
                </div>
                <span className="ds-section-count">
                  {demos.length} {demos.length === 1 ? "DEMO" : "DEMOS"}
                </span>
              </header>

              <div className="ds-grid">
                {demos.map((d) => (
                  <article key={d.id} className="ds-card">
                    <div className="ds-card-ribbon">
                      <div className="ds-card-ribbon-left">
                        <span className="ds-card-ribbon-icon">{industry.icon}</span>
                        <span className="ds-card-ribbon-text">{industry.nameEn}</span>
                      </div>
                      <span className="ds-card-ribbon-number">
                        CASE / {String(DEMOS.indexOf(d) + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="ds-card-body">
                      <h3 className="ds-card-title">{d.title}</h3>
                      <div className="ds-card-sub">{d.subtitle}</div>

                      <div className="ds-tags">
                        {d.tags.map((t) => (
                          <span key={t} className="ds-tag">#{t}</span>
                        ))}
                      </div>

                      <div className="ds-block">
                        <span className="ds-block-label">OVERVIEW / 概要</span>
                        <p className="ds-block-body">{d.overview}</p>
                      </div>

                      <div className="ds-challenge">
                        <span className="ds-block-label">CHALLENGE / 業界課題</span>
                        <p className="ds-block-body">{d.challenge}</p>
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
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

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
                  業務改善カタログを見る
                </a>
                <a
                  className="ds-btn-ghost"
                  href={ESTIMATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">&#128176;</span>
                  自動見積もり
                </a>
                <a
                  className="ds-btn-ghost"
                  href={CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
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
