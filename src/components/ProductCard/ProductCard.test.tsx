import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';

// Мок для корзины
const mockAddItem = vi.fn();
vi.mock('../../context/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem }),
}));

// Тестовые данные
const baseProduct: Product = {
  id: '1',
  name: 'Carrot',
  price: 2.99,
  image: '/carrot.jpg',
  category: 'vegetables',
  description: 'Fresh carrot',
};

// Хелпер рендера
const renderWithMantine = (ui: React.ReactNode) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe('ProductCard', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it('отображает название, цену, изображение и основные кнопки', () => {
    renderWithMantine(<ProductCard product={baseProduct} />);

    // Изображение
    const img = screen.getByAltText(baseProduct.name);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', baseProduct.image);

    // Название
    expect(screen.getByText(baseProduct.name)).toBeInTheDocument();

    // Цена
    expect(screen.getByText(`$${baseProduct.price}`)).toBeInTheDocument();

    // Кнопка "Add to cart"
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();

    // Кнопки "+" и "–" (ищем по иконкам)
    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => btn.querySelector('.tabler-icon-plus'));
    const minusButton = buttons.find(btn => btn.querySelector('.tabler-icon-minus'));
    expect(plusButton).toBeInTheDocument();
    expect(minusButton).toBeInTheDocument();
  });

  it('позволяет изменять количество (не меньше 1)', async () => {
    const user = userEvent.setup();
    renderWithMantine(<ProductCard product={baseProduct} />);

    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => btn.querySelector('.tabler-icon-plus'))!;
    const minusButton = buttons.find(btn => btn.querySelector('.tabler-icon-minus'))!;
    const quantity = screen.getByText('1');

    // Увеличиваем до 3
    await user.click(plusButton);
    await user.click(plusButton);
    expect(quantity).toHaveTextContent('3');

    // Уменьшаем до 1
    await user.click(minusButton);
    await user.click(minusButton);
    expect(quantity).toHaveTextContent('1');

    // Попытка уменьшить ниже 1
    await user.click(minusButton);
    expect(quantity).toHaveTextContent('1');
  });

  it('добавляет товар в корзину и сбрасывает количество', async () => {
    const user = userEvent.setup();
    renderWithMantine(<ProductCard product={baseProduct} />);

    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => btn.querySelector('.tabler-icon-plus'))!;

    // Устанавливаем количество = 2
    await user.click(plusButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    // Нажимаем "Add to cart"
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    // Проверяем вызов addItem
    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith(baseProduct, 2);

    // Количество сбрасывается до 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});