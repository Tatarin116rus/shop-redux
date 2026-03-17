import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';

// Мок для CartPopup
vi.mock('../CartPopup/CartPopup.tsx', () => ({
  default: ({ close }: { close: () => void }) => (
    <div data-testid="cart-popup">
      <button onClick={close} data-testid="close-popup">Закрыть</button>
    </div>
  ),
}));

// Мок для useCart
const mockUseCart = vi.fn();
vi.mock('../../context/CartContext', () => ({
  useCart: () => mockUseCart(),
}));

const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('Header Component', () => {
  beforeEach(() => {
    mockUseCart.mockReset();
  });

  it('корректно отображает логотип', () => {
    mockUseCart.mockReturnValue({ totalQuantity: 0 });
    renderWithMantine(<Header />);

    expect(screen.getByText('Vegetable')).toBeInTheDocument();
    expect(screen.getByText('SHOP')).toBeInTheDocument();
  });

  it('отображает бейдж с количеством товаров, если totalQuantity > 0', () => {
    mockUseCart.mockReturnValue({ totalQuantity: 5 });
    renderWithMantine(<Header />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('открывает и закрывает поповер корзины по клику', async () => {
    mockUseCart.mockReturnValue({ totalQuantity: 0 });
    renderWithMantine(<Header />);
    const user = userEvent.setup();

    const cartButton = screen.getByRole('button', { name: /cart/i });

    // Открываем поповер
    await user.click(cartButton);
    await waitFor(() => {
      expect(screen.getByTestId('cart-popup')).toBeInTheDocument();
    });

    // Закрываем через кнопку внутри мока
    await user.click(screen.getByTestId('close-popup'));
    await waitFor(() => {
      expect(screen.queryByTestId('cart-popup')).not.toBeInTheDocument();
    });
  });
});