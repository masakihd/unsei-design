import IntroRegisterForm from "../../components/IntroRegisterForm";

export default function OnboardingPage() {
  return <IntroRegisterForm />;
}

// SSRで初期化の不整合を回避（安全弁）
export async function getServerSideProps() {
  return { props: {} };
}
