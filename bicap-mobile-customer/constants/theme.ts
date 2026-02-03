// constants/theme.ts
export const Colors = {
    primary: '#10B981', // Emerald 500 (Thân thiện nông nghiệp)
    secondary: '#3B82F6', // Blue 500
    accent: '#F59E0B', // Amber 500
    background: '#F9FAFB', // Slate 50
    card: '#FFFFFF',
    text: '#111827',
    textLight: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const Typography = {
    h1: {
        fontSize: 24,
        fontWeight: '700' as const,
    },
    h2: {
        fontSize: 20,
        fontWeight: '600' as const,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        color: Colors.textLight,
    },
};
