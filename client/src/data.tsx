export type Product = {
    id: string;
    name: string;
    type: ProductType;
    unit: Unit;
    priceperunit: number;
    quantity: number;
    variety: string;
    perishdate: Date;
    location: string;
    status: ProductStatus;
    description: string;
    images: any; 
    locationlatitude: number;
    locationlongitude: number;
    createdAt: Date;
    updatedAt: Date;
    discount: number;
    supplierthreshold: number;
    farmerdelivery: boolean;
    servicedelivery: boolean;
    farmerid: string;
    farmerobj: Farmer;
    reviews: Review[];
    orders: Order[];
  };
  // Enums
export enum DeliveryType {
    BUYER = 'BUYER',
    SUPPLIER = 'SUPPLIER'
  }
  
  export enum Tracking {
    DELIVERED = 'DELIVERED',
    ENROUTE = 'ENROUTE',
    PACKING = 'PACKING',
    PACKED = 'PACKED'
  }
  
  export enum Delivery {
    FARMER = 'FARMER',
    SELF = 'SELF',
    SERVICE = 'SERVICE'
  }
  
  export enum Rating {
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE',
    FOUR = 'FOUR',
    FIVE = 'FIVE',
    SIX = 'SIX',
    SEVEN = 'SEVEN',
    EIGHT = 'EIGHT',
    NINE = 'NINE',
    TEN = 'TEN'
  }
  
  export enum Role {
    guest='guest',
    buyer = 'buyer',
    supplier = 'supplier',
    farmer = 'farmer',
    admin = 'admin',
    worker = 'worker'
  }
  
  export enum ProductType {
    FRUIT = 'FRUIT',
    VEGETABLE = 'VEGETABLE',
    GRAIN = 'GRAIN',
    LEGUME = 'LEGUME',
    TUBER = 'TUBER',
    DAIRY = 'DAIRY',
    MEAT = 'MEAT',
    POULTRY = 'POULTRY',
    OTHER = 'OTHER'
  }
  
  export enum Unit {
    KG = 'KG',
    LITERS = 'LITERS',
    BAGS = 'BAGS',
    CRATES = 'CRATES',
    BUNCHES = 'BUNCHES',
    PIECES = 'PIECES',
    OTHER = 'OTHER'
  }
  
  export enum ProductStatus {
    AVAILABLE = 'AVAILABLE',
    SOLD = 'SOLD',
    PENDING = 'PENDING',
    EXPIRED = 'EXPIRED',
    RESERVED = 'RESERVED'
  }
  
  // Types
  export type User = {
    id: string;
    firstname: string;
    isactive: boolean;
    email: string;
    usertype: Role;
  };
  
  export type Farmer = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    isactive: boolean;
    products: Product[];
    Order: Order[];
  };
  
  export type Buyer = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    isactive: boolean;
    Order: Order[];
  };
  
  export type Supplier = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    isactive: boolean;
    Order: Order[];
  };
  
  export type Review = {
    id: string;
    userId: string;
    rating: Rating;
    comment: string;
    productid: string;
    productobj: Product;
  };
  
 
  
  export type Order = {
    id: string;
    customertype: DeliveryType;
    userId: string;
    user: Buyer;
    productid: string;
    productobj: Product;
    farmerid: string;
    farmerobj: Farmer;
    deliverylatitude: number;
    deliverylongitude: number;
    deliveryoption: Delivery;
    totalcost: number;
    createdAt: Date;
    updatedAt: Date;
    tracking: Tracking;
  };
  