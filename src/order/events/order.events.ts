export class OrderAcceptedEvent {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly orderUser: string,
    public readonly orderItem: string,
    public readonly orderAmount: number,
  ) {}
}

export class OrderPlacedEvent {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly orderUser: string,
    public readonly orderItem: string,
    public readonly orderAmount: number,
  ) {}
}

export class OrderInventoryCheckedEvent {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly orderUser: string,
    public readonly orderItem: string,
    public readonly orderAmount: number,
  ) {}
}

export class OrderPaymentCompletedEvent {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly orderUser: string,
    public readonly orderItem: string,
    public readonly orderAmount: number,
  ) {}
}

export class OrderCompletedEvent {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly orderItem: string,
    public readonly orderAmount: number,
    public readonly user: { email: string; id: number },
  ) {}
}

export class OrderEventFail {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly error: object,
  ) {}
}
