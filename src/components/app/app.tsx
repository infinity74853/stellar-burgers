import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Страницы
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

// Компоненты
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

// Стили
import styles from './app.module.css';

// Redux
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { selectIngredientsLoaded } from '../../services/slices/ingredientsSlice';
import { getCookie } from '../../utils/cookie';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const background = location.state?.background || null;
  const ingredientsLoaded = useSelector(selectIngredientsLoaded);

  // Загрузка ингредиентов и проверка авторизации
  useEffect(() => {
    if (!ingredientsLoaded) {
      dispatch(fetchIngredients()).catch((err) =>
        console.error('Не удалось загрузить ингредиенты:', err)
      );
    }

    const token = getCookie('accessToken');
    if (token && !location.pathname.includes('login')) {
      dispatch(checkUserAuth()).catch((err) =>
        console.error('Ошибка проверки авторизации:', err)
      );
    }
  }, [dispatch, ingredientsLoaded]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.content}>
          <Routes location={background || location}>
            {/* Публичные страницы */}
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />

            {/* Авторизация */}
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            {/* Профиль пользователя */}
            <Route
              path='/account'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/account/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/account/order-history'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/account/order-history/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            {/* Редиректы */}
            <Route
              path='/profile'
              element={<Navigate to='/account/profile' replace />}
            />
            <Route
              path='/profile/orders'
              element={<Navigate to='/account/order-history' replace />}
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модальные окна */}
          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title='Детали заказа' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/account/order-history/:number'
                element={
                  <ProtectedRoute>
                    <Modal title='Детали заказа' onClose={handleModalClose}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
