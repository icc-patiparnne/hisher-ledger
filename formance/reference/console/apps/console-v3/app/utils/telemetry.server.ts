export function logTelemetryInfo(
  isMicroStack: boolean,
  apiUrl: string,
  telemetry?: string
) {
  if (isMicroStack) {
    console.info('🚀 Formance Console - Microstack Mode');
    console.info(`🌐 API URL: ${apiUrl}`);

    const isEnabled = telemetry !== 'false';
    if (isEnabled) {
      console.info(
        '📊 Telemetry is enabled. This helps us improve the product by collecting anonymous usage data.'
      );
      console.info(
        '💡 To opt out, set TELEMETRY=false in your environment variables.'
      );
    } else {
      console.info('📊 Telemetry is disabled.');
    }
  } else {
    console.info('☁️  Formance Console - Cloud Mode');
    console.info(`🌐 API URL: ${apiUrl}`);
    console.info(
      '📊 Telemetry is always enabled in cloud mode to help us improve the product.'
    );
  }
}
