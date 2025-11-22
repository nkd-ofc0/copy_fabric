import { CopyTool } from '@/components/CopyTool';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          CopyFactory <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Ferramenta Profissional
        </p>
      </div>
      
      {/* Chama a ferramenta sem nicho específico */}
      <CopyTool defaultNiche="" />
    </div>
  );
}
