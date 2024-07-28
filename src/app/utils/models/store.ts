export interface Store {
    id: string;
    name: string;
    location: {
      id: number;
      address: string;
      city: string;
      state: string;
      postalCode: string;
    };
    openingHours: {
      id: number;
      monday: { open: string; close: string };
      tuesday: { open: string; close: string };
      wednesday: { open: string; close: string };
      thursday: { open: string; close: string };
      friday: { open: string; close: string };
      saturday: { open: string; close: string };
      sunday: { open: string; close: string };
    };
    contact: {
      id: number;
      phone: string;
      email: string;
      whatsapp: string;
    };
    description: string;
    imageUrl: string;
    organization: {
      id: string;
      legalName: string;
      number: number;
      country: string;
      isDeleted: boolean;
      isEnabled: boolean;
    };
    isEnabled: boolean;
  }

  