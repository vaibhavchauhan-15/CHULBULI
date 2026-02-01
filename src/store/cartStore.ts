import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  discount: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  selectedItems: string[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getSelectedTotalPrice: () => number
  getSelectedItems: () => CartItem[]
  toggleItemSelection: (id: string) => void
  selectAllItems: () => void
  deselectAllItems: () => void
  isItemSelected: (id: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          })
        } else {
          // Auto-select newly added items
          set({ 
            items: [...items, item],
            selectedItems: [...get().selectedItems, item.id]
          })
        }
      },
      
      removeItem: (id) => {
        set({ 
          items: get().items.filter((i) => i.id !== id),
          selectedItems: get().selectedItems.filter((selectedId) => selectedId !== id)
        })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const finalPrice = item.price - (item.price * item.discount) / 100
          return total + finalPrice * item.quantity
        }, 0)
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSelectedTotalPrice: () => {
        const selectedIds = get().selectedItems
        return get().items
          .filter((item) => selectedIds.includes(item.id))
          .reduce((total, item) => {
            const finalPrice = item.price - (item.price * item.discount) / 100
            return total + finalPrice * item.quantity
          }, 0)
      },

      getSelectedItems: () => {
        const selectedIds = get().selectedItems
        return get().items.filter((item) => selectedIds.includes(item.id))
      },

      toggleItemSelection: (id) => {
        const selectedItems = get().selectedItems
        if (selectedItems.includes(id)) {
          set({ selectedItems: selectedItems.filter((selectedId) => selectedId !== id) })
        } else {
          set({ selectedItems: [...selectedItems, id] })
        }
      },

      selectAllItems: () => {
        set({ selectedItems: get().items.map((item) => item.id) })
      },

      deselectAllItems: () => {
        set({ selectedItems: [] })
      },

      isItemSelected: (id) => {
        return get().selectedItems.includes(id)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
