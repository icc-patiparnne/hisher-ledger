import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import * as grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

dotenv.config();

const getExporter = (
  otelTracesExporter,
  otelTracesExporterOtlpEndpoint,
  otelServiceName
) => {
  switch (otelTracesExporter) {
    case 'zipkin':
      console.info(
        `Exporter configured with ZIPKIN with endpoint: ${otelTracesExporterOtlpEndpoint}`
      );

      return new ZipkinExporter({
        url: otelTracesExporterOtlpEndpoint,
        serviceName: otelServiceName,
      });
    case 'otlp':
      console.info(
        `Exporter configured with OTLP endpoint: ${otelTracesExporterOtlpEndpoint}`
      );

      return new OTLPTraceExporter({
        url: otelTracesExporterOtlpEndpoint,
        concurrencyLimit: 10, // an optional limit on pending requests
        credentials: grpc.credentials.createInsecure(),
      });
    case 'console':
      console.info('Exporter configured with CONSOLE');

      return new ConsoleSpanExporter();
    case undefined:
      return;
    case '':
      return;
    default:
      throw new Error(
        `Unexpected OpenTelemetry exporter type:
            ${otelTracesExporter}`
      );
  }
};

export const initServerSideTraces = (
  otelTracesExporter,
  otelTracesExporterOtlpEndpoint,
  otelServiceName
) => {
  const exporter = getExporter(
    otelTracesExporter,
    otelTracesExporterOtlpEndpoint,
    otelServiceName
  );

  const resource = new Resource({
    ['service.name']: otelServiceName,
  });
  const instrumentations = [
    new HttpInstrumentation({
      ignoreIncomingRequestHook: (request) => request.url === '/_info',
    }),
  ];
  const tracerProvider = new NodeTracerProvider({ resource, instrumentations });

  tracerProvider.addSpanProcessor(new BatchSpanProcessor(exporter));

  const propagator = new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new B3Propagator()],
  });

  tracerProvider.register({ propagator });

  console.log(
    `Otel Server Side initialized with service ${otelServiceName.toUpperCase()} and exporter ${otelTracesExporter.toUpperCase()}`
  );
};

if (
  typeof process !== 'undefined' &&
  process.env.OTEL_TRACES &&
  process.env.OTEL_TRACES_EXPORTER &&
  process.env.OTEL_TRACES_EXPORTER_OTLP_ENDPOINT &&
  process.env.OTEL_SERVICE_NAME &&
  (process.env.OTEL_TRACES == '1' || process.env.OTEL_TRACES == 'true')
) {
  initServerSideTraces(
    process.env.OTEL_TRACES_EXPORTER,
    process.env.OTEL_TRACES_EXPORTER_OTLP_ENDPOINT,
    process.env.OTEL_SERVICE_NAME
  );
}
