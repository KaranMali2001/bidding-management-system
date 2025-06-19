import { Loader2 } from "lucide-react";
export default function MinimalLoadingPage({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#2F81F7] to-[#1F6FEB] rounded-lg flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
        <h2 className="text-lg font-medium text-[#C9D1D9] mb-2">{message}</h2>
        <div className="w-32 h-1 bg-[#1F2A36] rounded-full mx-auto">
          <div
            className="h-1 bg-gradient-to-r from-[#2F81F7] to-[#1F6FEB] rounded-full animate-pulse"
            style={{ width: "50%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
