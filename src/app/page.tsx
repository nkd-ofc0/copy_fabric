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
      
      {/* ...CopyTool acima... */}
      <CopyTool defaultNiche="" />

      <div className="mt-20 mb-10 text-center space-y-4">
         <div className="h-px w-16 bg-slate-200 mx-auto"></div>
         
         <div className="flex flex-col items-center gap-1">
           <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
             Criado e Desenvolvido por
           </p>
           <a 
             href="https://instagram.com/SEU_INSTAGRAM" 
             target="_blank" 
             className="text-blue-600 font-black text-sm hover:underline flex items-center gap-1"
           >
             NKD <span className="text-slate-300 font-normal">| Tecnologia & Growth</span>
           </a>
         </div>
      </div>
    </div>
  );
}
}
