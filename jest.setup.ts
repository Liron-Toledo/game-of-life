import '@testing-library/jest-dom';

// Mock matchMedia for media queries
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock Local Storage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: jest.fn(key => delete store[key]),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

const mockResponse = jest.fn();
Object.defineProperty(window, 'location', {
    value: {
        hash: {
            endsWith: mockResponse,
            includes: mockResponse,
        },
        assign: mockResponse,
    },
    writable: true,
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");

const originalConsoleError = console.error;

beforeAll(() => {
    console.error = jest.fn((...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Not implemented: navigation') ||
                args[0].includes('Failed to import grid'))
        ) {
            // Suppress these specific error messages
            return;
        }
        // Otherwise, log the error as usual
        originalConsoleError(...args);
    });
});

afterAll(() => {
    console.error = originalConsoleError;
});