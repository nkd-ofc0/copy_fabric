export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Política de Privacidade</h1>
        <div className="prose prose-slate text-slate-600 space-y-4">
          <p>A sua privacidade é importante para nós. É política do CopyFactory respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar.</p>
          
          <h2 className="text-xl font-semibold text-slate-800 mt-4">1. Informações que Coletamos</h2>
          <p>Coletamos apenas as informações necessárias para o funcionamento do serviço, especificamente os dados de uso da ferramenta (prompts) para geração do conteúdo.</p>

          <h2 className="text-xl font-semibold text-slate-800 mt-4">2. Cookies e Armazenamento Local</h2>
          <p>Utilizamos o LocalStorage do seu navegador para salvar suas preferências e status de acesso (VIP/Gratuito). Não utilizamos cookies de rastreamento de terceiros invasivos.</p>

          <h2 className="text-xl font-semibold text-slate-800 mt-4">3. Compartilhamento de Dados</h2>
          <p>Não compartilhamos suas informações pessoais publicamente ou com terceiros, exceto quando exigido por lei. Os dados dos textos gerados são processados pela API do Google Gemini.</p>
        </div>
      </div>
    </div>
  );
}
