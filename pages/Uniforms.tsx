import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Uniforms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto w-full mb-20">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-4">
            <span className="material-icons-round text-xl mr-1">arrow_back</span>
            <span className="text-sm font-medium">Voltar</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solicitar Uniforme <span className="text-gray-500 dark:text-gray-400 font-normal text-lg">(Professor)</span></h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie seus pedidos de uniforme para aulas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="material-icons-round mr-2 text-primary">add_shopping_cart</span>
                Novo Pedido
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="combo">Combo</label>
                    <div className="relative">
                        <select className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 appearance-none" id="combo" name="combo">
                            <option>Combo Padrão</option>
                            <option>Combo Graduado</option>
                            <option>Kit Completo (Calça + Camisa)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <span className="material-icons-round">expand_more</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="tamanho">Tamanho (Camisa)</label>
                        <input className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 py-2.5 px-3" id="tamanho" name="tamanho" placeholder="Ex: M, G, GG" type="text"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="numero">Numeração (Calça)</label>
                        <input className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 py-2.5 px-3" id="numero" name="numero" placeholder="Ex: 40, 42" type="text"/>
                    </div>
                </div>
                <button className="w-full mt-4 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-[1.01]">
                    Fazer Pedido
                </button>
            </form>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                    <span className="material-icons-round mr-2 text-primary">history</span>
                    Meus Pedidos
                </h2>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">3 Itens</span>
            </div>
            <div className="space-y-4">
                <div className="group relative bg-gray-50 dark:bg-surface-darker rounded-lg p-3 border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Blusa Oficial</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pedido #1024 • 12 Out 2023</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Total: R$ 30,00</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Entregue
                        </span>
                    </div>
                </div>
                <div className="group relative bg-gray-50 dark:bg-surface-darker rounded-lg p-3 border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Calça Abada (G)</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pedido #1020 • 20 Set 2023</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Total: R$ 85,00</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Entregue
                        </span>
                    </div>
                </div>
                <div className="group relative bg-gray-50 dark:bg-surface-darker rounded-lg p-3 border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Corda Graduado</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pedido #1035 • 15 Nov 2023</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Total: R$ 15,00</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Em Processamento
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <a className="text-sm text-primary hover:text-red-500 font-medium" href="#">Ver histórico completo</a>
            </div>
        </section>
      </div>
    </div>
  );
};