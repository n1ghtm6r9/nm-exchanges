import {
  GetMarketDataRequestDto,
  GetMarketDataResponseDto,
  GetFundingDataRequestDto,
  GetFundingDataResponseDto,
  GetBalanceRequestDto,
  GetBalanceResponseDto,
  GetTradePairInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoRequestDto,
  GetTradePairsInfoResponseDto,
  GetOrderByIdRequestDto,
  GetOrderByIdResponseDto,
  GetOrderBookRequestDto,
  GetOrderBookResponseDto,
  MarketDataStreamRequestDto,
  MarketDataStreamResponseDto,
  AccountDataStreamRequestDto,
  AccountDataStreamResponseDto,
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  CreateOrdersRequestDto,
  CreateOrdersResponseDto,
  CancelOrderRequestDto,
  CancelOrderResponseDto,
  UpdateTradingMultiplierRequestDto,
  UpdateTradingMultiplierResponseDto,
} from '../dto';

export interface IExchangeProviderMethods {
  getOrderBook(options: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto>;
  getMarketData(options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto>;
  getFundingData(options: GetFundingDataRequestDto): Promise<GetFundingDataResponseDto>;
  getBalance(options: GetBalanceRequestDto): Promise<GetBalanceResponseDto>;
  getTradePairInfo(options: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto>;
  getTradePairsInfo(input?: GetTradePairsInfoRequestDto): Promise<GetTradePairsInfoResponseDto>;
  getOrderById(options: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto>;
  updateTradingMultiplier(options: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto>;
  marketDataStream(options: MarketDataStreamRequestDto): Promise<MarketDataStreamResponseDto>;
  accountDataStream(options: AccountDataStreamRequestDto): Promise<AccountDataStreamResponseDto>;
  createOrder(options: CreateOrderRequestDto): Promise<CreateOrderResponseDto>;
  createOrders(options: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto>;
  cancelOrder(options: CancelOrderRequestDto): Promise<CancelOrderResponseDto>;
}
