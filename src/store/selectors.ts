import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { shallow } from 'zustand/shallow'

// Optimized selectors to prevent unnecessary re-renders

// Auth selectors
export const useUser = () => useAuthStore((state) => state.user, shallow)
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin())
export const useAuthActions = () => useAuthStore(
  (state) => ({ setAuth: state.setAuth, logout: state.logout }),
  shallow
)

// Cart selectors
export const useCartItems = () => useCartStore((state) => state.items, shallow)
export const useCartCount = () => useCartStore((state) => state.getTotalItems())
export const useCartTotal = () => useCartStore((state) => state.getTotalPrice())
export const useCartActions = () => useCartStore(
  (state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
  }),
  shallow
)
