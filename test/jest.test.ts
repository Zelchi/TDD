test('Devo conhecer as principais assertivas do jest', () => {
    const number1 = null;
    const number2 = 10;
    expect(number1).toBeNull();
    expect(number2).toBeDefined();
    expect(number2).toBeTruthy();
    expect(number2).toBeGreaterThan(5);
    expect(number2).toBeLessThan(15);
    expect(number2).toBeCloseTo(10, 1);
    expect(number2).toEqual(expect.any(Number));
})

test('Devo saber trabalhar com objetos', () => {
    const obj = { name: 'João', age: 30 };
    expect(obj).toHaveProperty('name');
    expect(obj).toHaveProperty('age', 30);
    expect(obj.name).toMatch(/João/);
    expect(obj).toEqual(expect.objectContaining({ name: 'João' }))

    const obj2 = { name: 'João', age: 30 };
    expect(obj).toEqual(obj2);
    expect(obj).not.toBe(obj2); // Diferentes referências de objeto
    expect(obj).toBe(obj); // Mesma referência de objeto
})