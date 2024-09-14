import dynamic from "next/dynamic";

const View = dynamic(() => import("./view"), { ssr: true });

export default function Page() {
  return <View />;
}
