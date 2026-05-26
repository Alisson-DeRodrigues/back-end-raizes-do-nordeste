export interface ErrorDetail {
    field: string;
    issue: string;
}

export const createErrorMessage = (
    errorName: string,
    message: string,
    path?: string,
    details: ErrorDetail[] = [],
    requestId?: string
) => {
    return {
        error: errorName,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: path || null,
        requestId: requestId || null
    };
}