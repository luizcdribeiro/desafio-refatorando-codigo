import { useEffect, useState } from 'react';

import Header from '../../components/Header/index'
import api from '../../services/api';
import Food from '../../components/Food/index';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodDashboardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export default function Dashboard () {
  
  const [foods, setFoods] = useState<FoodDashboardProps[]>([]);
  const [editingFood, setEditingFood] = useState<FoodDashboardProps>({} as FoodDashboardProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    
    async function fetchData() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    fetchData();
  }, []);

  const handleUpdateFood = async (food: Omit<FoodDashboardProps, 'id' | 'available'>) => {
    try {
      const foodUpdate = await api.put(
        `/foods/${editingFood.id}`,
        {...editingFood, ...food }
      );

      const foodsUpdate = foods.map(item => item.id !== foodUpdate.data.id ? item : foodUpdate.data);

      setFoods(foodsUpdate);
    } catch(error) {
      console.log(error);
    }
  }

  const handleAddFood = async (food: Omit<FoodDashboardProps, 'id' | 'available'> ) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods(oldState => [...oldState, response.data]);
    }catch(error) {
      console.log(error);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal () {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodDashboardProps) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDeleteFood={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
