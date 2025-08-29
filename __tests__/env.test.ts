describe('Environment Variables', () => {
  it('PALADIUM_API_URL should be defined', () => {
    expect(process.env.PALADIUM_API_URL).toBeDefined();
  });

  it('NEXT_PUBLIC_PALACLICKER_API_URL should be defined', () => {
    expect(process.env.NEXT_PUBLIC_PALACLICKER_API_URL).toBeDefined();
  });

  it('NEXT_PUBLIC_PALACLICKER_API_WS should be defined', () => {
    expect(process.env.NEXT_PUBLIC_PALACLICKER_API_WS).toBeDefined();
  });

  it('PALADIUM_API_KEY should be defined', () => {
    expect(process.env.PALADIUM_API_KEY).toBeDefined();
  });
});
