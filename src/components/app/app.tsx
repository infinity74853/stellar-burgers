import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { AppHeader } from '../app-header/app-header';
import styles from './app.module.css';
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
  const background = location.state?.background;
  const ingredientsLoaded = useSelector(selectIngredientsLoaded);

  useEffect(() => {
    if (!ingredientsLoaded) {
      dispatch(fetchIngredients()).catch((err) =>
        console.error('Failed to load ingredients:', err)
      );
    }

    dispatch(checkUserAuth());
  }, [dispatch, ingredientsLoaded]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />

          {/* Публичные маршруты */}
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

          {/* Защищенные маршруты */}
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

          {/* Редиректы для старых маршрутов */}
          <Route
            path='/profile'
            element={<Navigate to='/account/profile' replace />}
          />
          <Route
            path='/profile/orders'
            element={<Navigate to='/account/order-history' replace />}
          />
          <Route
            path='/profile/orders/:number'
            element={<Navigate to='/account/order-history/:number' replace />}
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
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
