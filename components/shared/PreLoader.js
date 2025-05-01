"use client";

export default function SignalLoader({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="flex flex-col items-center">
        <div className="flex items-end gap-1 h-16 mb-4">
          <div className="w-4 bg-gray-300 rounded-t-sm animate-grow delay-75" style={{ height: '25%' }}></div>
          <div className="w-4 bg-gray-400 rounded-t-sm animate-grow delay-150" style={{ height: '50%' }}></div>
          <div className="w-4 bg-gray-500 rounded-t-sm animate-grow delay-300" style={{ height: '75%' }}></div>
          <div className="w-4 bg-gray-600 rounded-t-sm animate-grow delay-500" style={{ height: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}