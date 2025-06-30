import LandingPage from "@/components/LandingPage/landingPage";
import axios from "axios";

export default function Home() {
  axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`);
  return <LandingPage />;
}
