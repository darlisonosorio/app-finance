import Toolbar from 'host/Toolbar';
import ConfirmModal from 'host/ConfirmModal';
import { useNavigate, useLocation } from "react-router-dom";
import type { ListFinanceDto, ListFinanceResult } from '../models/listFinance';
import { PencilIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { fetchFinances, deleteFinance } from '../services/FinanceService';
import { toast } from "react-toastify";

function FinancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [toDelete, setToDelete] = useState<ListFinanceDto|null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [financesResult, setFinanceResult] = useState<ListFinanceResult>({
    data: [],
    meta: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    search(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, location.key]);

  const search = async (page: number, term: string) => {
    try {
      const result = await fetchFinances(page, 10, term);
      setFinanceResult(result);
    } catch (e) {
      toast.error("Erro ao buscar lista de finanças.");
    }
  }

  const handleCreate = () => {
    navigate(`${location.pathname}/add`);
  };

  const handleEdit = (finance: ListFinanceDto) => {
    navigate(`${location.pathname}/${finance.id}`);
  }

  const handleDelete = async () => {
    try {
      await deleteFinance(toDelete!.id);
      setToDelete(null);
      toast.success("Finança removida.");
      search(financesResult.meta.page, debouncedSearchTerm);
    } catch(e) {
      toast.error("Erro ao remover finança.");
    }
  }

  const handlePrev = () => {
    if (!financesResult) return;
    const prevPage = Math.max(financesResult.meta.page - 1, 1);
    search(prevPage, debouncedSearchTerm);
  };

  const handleNext = () => {
    if (!financesResult) return;
    const nextPage = Math.min(financesResult.meta.page + 1, financesResult.meta.totalPages);
    search(nextPage, debouncedSearchTerm);
  };

  if (!financesResult) return null;

  return (
    <div className="relative bg-base-200">
      <Toolbar title="Finanças" />

      <main className="pt-16">

      <div className="px-4 mt-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar finanças..."
          className="flex-1 p-2 border rounded bg-base-100 text-base-content"
        />

        <button
          onClick={handleCreate}
          className="w-[170px] flex justify-between items-center p-2 rounded border border-primary bg-primary text-white hover:bg-primary/90"
        >
          Nova Finança
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-base-200 rounded shadow text-base-content mt-6">
            <thead className="bg-base-300">
              <tr>
                <th className="px-4 py-2 text-left">Descrição</th>
                <th className="px-4 py-2 text-center">Valor</th>
                <th className="px-4 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {financesResult.data.length > 0 
                ? (
                  financesResult.data.map(finance => (
                  <tr key={finance.id} className="border-b hover:bg-base-100">
                    <td className="px-4 py-2 text-left align-middle">{finance.description}</td>
                    <td className="px-4 py-2 align-middle">{finance.value}</td>
                    <td className="px-4 py-2 align-middle flex justify-end gap-2">
                      <a
                        onClick={() => handleEdit(finance)}
                        className="p-1 rounded hover:bg-base-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </a>
                      <a
                        onClick={() => setToDelete(finance)}
                        className="p-1 rounded hover:bg-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </a>
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-base-content">
                    Nenhuma finança encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <a
              onClick={financesResult?.meta?.page <= 1 ? () => {} : handlePrev}
              className="p-2 rounded bg-base-300 hover:bg-base-400 disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </a>
            <span>Página {financesResult?.meta?.page} de {financesResult?.meta?.totalPages}</span>
              <a
                onClick={financesResult?.meta?.page === financesResult?.meta?.totalPages ? () => {} : handleNext}
                className="p-2 rounded bg-base-300 hover:bg-base-400 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </a>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={toDelete !== null}
        message="Deseja realmente remover este item?"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

    </div>
  );
}

export default FinancePage;
