import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import CartPopup from './CartPopup';

// Мок для ResizeObserver (нужен для ScrollArea)
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
// Начальные данные корзины
const initialItems = [
  {
    id: '1',
    name: 'Carrot',
    price: 2.99,
    image: '/carrot.jpg',
    quantity: 2,
  },
  {
    id: '2',
    name: 'Apple',
    price: 1.5,
    image: '/apple.jpg',
    quantity: 3,
  },
];

// Состояние, которое будет мутировать в тестах
let mockItems = [...initialItems];
const mockUpdateQuantity = vi.fn((id, newQuantity) => {
  const item = mockItems.find(i => i.id === id);
  if (item) item.quantity = newQuantity;
});

const mockUseCart = vi.fn(() => ({
  items: mockItems,
  totalPrice: mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  updateQuantity: mockUpdateQuantity,
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => mockUseCart(),
}));

const renderWithMantine = (ui: React.ReactNode) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe('CartPopup', () => {
  beforeEach(() => {
    // Сбрасываем состояние перед каждым тестом
    mockItems = initialItems.map(item => ({ ...item }));
    mockUpdateQuantity.mockClear();
  });

  it('отображает пустое состояние, когда нет товаров', () => {
    mockItems = [];
    mockUseCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      updateQuantity: mockUpdateQuantity,
    });

    renderWithMantine(<CartPopup close={() => {}} />);

    expect(screen.getByText(/ты забыл добавить продукты/i)).toBeInTheDocument();
    expect(screen.getByText(/корзинке грустно/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'src\\assets\\cart_empty.svg');
  });

  it('отображает список товаров и общую сумму, когда корзина не пуста', () => {
    mockUseCart.mockReturnValue({
      items: mockItems,
      totalPrice: mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      updateQuantity: mockUpdateQuantity,
    });

    renderWithMantine(<CartPopup close={() => {}} />);

    // Проверяем наличие товаров
    expect(screen.getByText('Carrot')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('$2.99')).toBeInTheDocument();
    expect(screen.getByText('$1.5')).toBeInTheDocument();

    // Проверяем количество (цифры)
    const quantities = screen.getAllByText(/^[0-9]+$/);
    expect(quantities).toHaveLength(2);
    expect(quantities[0]).toHaveTextContent('2');
    expect(quantities[1]).toHaveTextContent('3');

    // Проверяем общую сумму
    const total = (2.99 * 2 + 1.5 * 3).toFixed(2);
    expect(screen.getByText(`$${total}`)).toBeInTheDocument();
  });

  it('вызывает updateQuantity при клике на кнопки + и -', async () => {
    const user = userEvent.setup();
    mockUseCart.mockReturnValue({
      items: mockItems,
      totalPrice: mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      updateQuantity: mockUpdateQuantity,
    });

    renderWithMantine(<CartPopup close={() => {}} />);

    // Находим кнопки по тексту
    const minusButtons = screen.getAllByRole('button', { name: '–' });
    const plusButtons = screen.getAllByRole('button', { name: '+' });

    // Клик по минусу для первого товара (Carrot)
    await user.click(minusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
    expect(mockItems[0].quantity).toBe(1);

    // Клик по плюсу для первого товара
    await user.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
    expect(mockItems[0].quantity).toBe(2);

    // Клик по плюсу для второго товара (Apple)
    await user.click(plusButtons[1]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('2', 4);
    expect(mockItems[1].quantity).toBe(4);
  });
});