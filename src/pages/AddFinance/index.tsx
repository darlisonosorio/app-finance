import Toolbar from 'host/Toolbar';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { type FinanceForm } from "../../models/financeForm";
import { toast } from "react-toastify";
import { createFinance, getFinance, updateFinance } from "../../services/FinanceService";
import { fetchUsers } from '../../services/UsersService';
import AsyncSelect from "react-select/async";
import type { ListUserDto } from '../../models/listUser';

import './styles.css';



const AddFinancePage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();
  const navigate = useNavigate();

  const backPage = useMemo(() => {
    return location.pathname.substring(0, location.pathname.lastIndexOf('/'));
  }, [location.pathname]);

  const [previousUser, setPreviousUser] = useState<ListUserDto|null>();
  const [users, setUsers] = useState<ListUserDto[]>([]);
  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FinanceForm>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      loadFinance();
    }
  }, [isEdit, id, reset]);

  useEffect(() => {
    if (previousUser) {
      loadOptions('');
    }
  }, [previousUser]);

  const loadFinance = async () => {
    try {
      const finance = await getFinance(Number(id));
      const previousUser = {
        id: finance.user_id,
        name: finance.user_name ?? '',
        email: '',
        status: 'active'
      };
      
      setPreviousUser(previousUser)

      const financeForm: FinanceForm = {
        user_id: finance.user_id,
        value: finance.value,
        description: finance.description
      }
      reset(financeForm);
      setLoading(false);
    } catch(e) {
      toast.error("Erro ao carregar finança.");
      navigate(backPage);
    }
  }

  const onSubmit = async (data: FinanceForm) => {
    try {
      if (isEdit && id) {
        await updateFinance(Number(id), data);
        toast.success("Finança atualizada com sucesso!");
      } else {
        await createFinance(data);
        toast.success("Finança criada com sucesso!");
      }
      navigate(backPage);
    } catch (e) {
      toast.error(isEdit ? "Erro ao atualizar finança." : "Erro ao criar finança.");
    }
  };

  const loadOptions = useCallback(async (inputValue: string) => {
    let users = (await fetchUsers(1, 50, inputValue)).data;
    if (previousUser && !users.some(user => user.id === previousUser.id)) {
      users = [
        previousUser,
        ...users
      ]
    }
      
    console.log('setUsers', users, previousUser, users.some(user => user.id === previousUser?.id));
    setUsers(users);
    return users.map((user) => ({ label: user.name, value: user.id }));
  }, [previousUser]);

  return (
    <div className="relative bg-base-200 min-h-screen">
      <Toolbar title={isEdit ? 'Editar Finança' : 'Nova Finança'} backPage={backPage} />

      <main className="pt-16 mx-auto p-4">
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : (
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="mt-12 space-y-4 bg-base-100 p-6 rounded shadow text-left"
        >
          <div>
            <label className="block mb-1 font-medium text-left">Usuário</label>
            <Controller
              name="user_id"
              control={control}
              rules={{ required: "Usuário é obrigatório" }}
              render={({ field }) => (
                <AsyncSelect
                  cacheOptions
                  defaultOptions={users.map((user) => ({ label: user.name, value: user.id }))}
                  loadOptions={loadOptions}
                  onChange={(val) => field.onChange(val?.value)}
                  value={
                    field.value
                      ? { value: field.value, label: users.find(u => u.id === field.value)?.name || '' }
                      : null
                  }
                  placeholder="Buscar usuário..."
                  classNamePrefix="select"
                  className="text-left"
                />
              )}
            />
            {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium text-left">Valor</label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full text-left"
              {...register("value", { required: "Valor é obrigatório", valueAsNumber: false })}
            />
            {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium text-left">Descrição</label>
            <input
              type="text"
              className="input input-bordered w-full text-left"
              {...register("description", { required: "Descrição é obrigatória", maxLength: 256 })}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(backPage)}
              className="w-[170px] btn btn-outline"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[170px] btn btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
        )}
      </main>
    </div>
  );
}

export default AddFinancePage;
