export type Database = {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          icon?: string | null;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          display_order?: number;
        };
      };
      menu_items: {
        Row: {
          id: number;
          category_id: number;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          tags: string[] | null;
          is_available: boolean;
          is_featured: boolean;
          is_vegetarian: boolean;
          is_vegan: boolean;
          spice_level: number | null;
          is_special_today: boolean;
          special_note: string | null;
          created_at: string;
        };
        Insert: {
          category_id: number;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          tags?: string[] | null;
          is_available?: boolean;
          is_featured?: boolean;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          spice_level?: number | null;
          is_special_today?: boolean;
          special_note?: string | null;
        };
        Update: {
          category_id?: number;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          tags?: string[] | null;
          is_available?: boolean;
          is_featured?: boolean;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          spice_level?: number | null;
          is_special_today?: boolean;
          special_note?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          table_number: number;
          customer_name: string | null;
          status: "new" | "acknowledged" | "preparing" | "ready" | "served" | "cancelled";
          notes: string | null;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          table_number: number;
          customer_name?: string | null;
          status?: "new" | "acknowledged" | "preparing" | "ready" | "served" | "cancelled";
          notes?: string | null;
          total: number;
        };
        Update: {
          status?: "new" | "acknowledged" | "preparing" | "ready" | "served" | "cancelled";
          notes?: string | null;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          menu_item_id: number;
          menu_item_name: string;
          menu_item_price: number;
          quantity: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          order_id: string;
          menu_item_id: number;
          menu_item_name: string;
          menu_item_price: number;
          quantity: number;
          notes?: string | null;
        };
        Update: {
          quantity?: number;
          notes?: string | null;
        };
      };
      reservations: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          occasion: string | null;
          special_requests: string | null;
          status: "pending" | "confirmed" | "cancelled";
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          occasion?: string | null;
          special_requests?: string | null;
          status?: "pending" | "confirmed" | "cancelled";
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string;
          date?: string;
          time?: string;
          guests?: number;
          occasion?: string | null;
          special_requests?: string | null;
          status?: "pending" | "confirmed" | "cancelled";
        };
      };
    };
  };
};

export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];
