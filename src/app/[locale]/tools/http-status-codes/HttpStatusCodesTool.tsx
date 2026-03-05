"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  useCase: string;
}

const statusCodes: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", useCase: "Large file uploads where the client checks if the server will accept the request before sending the body." },
  { code: 101, name: "Switching Protocols", description: "The server is switching protocols as requested by the client via the Upgrade header.", useCase: "Upgrading HTTP connection to WebSocket." },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet.", useCase: "Long-running WebDAV requests." },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message.", useCase: "Preloading resources while the server prepares the main response." },
  // 2xx Success
  { code: 200, name: "OK", description: "The request has succeeded. The meaning depends on the HTTP method used.", useCase: "Standard successful GET, POST, PUT responses." },
  { code: 201, name: "Created", description: "The request has been fulfilled and has resulted in one or more new resources being created.", useCase: "After a successful POST request that creates a new resource (user, record, etc.)." },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", useCase: "Async operations like sending emails or processing background jobs." },
  { code: 203, name: "Non-Authoritative Information", description: "The returned metadata is not exactly the same as available from the origin server.", useCase: "Responses modified by a proxy or middleware." },
  { code: 204, name: "No Content", description: "The server has successfully fulfilled the request and there is no content to send.", useCase: "Successful DELETE requests or updates with no response body." },
  { code: 205, name: "Reset Content", description: "The server has fulfilled the request and the client should reset the document view.", useCase: "After submitting a form, telling the client to clear the form." },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", useCase: "Video streaming, resumable file downloads." },
  { code: 207, name: "Multi-Status", description: "Conveys information about multiple resources in situations where multiple status codes might be appropriate.", useCase: "WebDAV batch operations." },
  // 3xx Redirection
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response. The client should choose one.", useCase: "Content negotiation with multiple representations available." },
  { code: 301, name: "Moved Permanently", description: "The requested resource has been permanently moved to a new URL.", useCase: "Domain migration, URL structure changes for SEO." },
  { code: 302, name: "Found", description: "The requested resource resides temporarily under a different URL.", useCase: "Temporary redirects after form submissions." },
  { code: 303, name: "See Other", description: "The response to the request can be found under a different URL using GET.", useCase: "Redirecting after POST to prevent form resubmission." },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the last request.", useCase: "Browser cache validation using ETag or Last-Modified headers." },
  { code: 307, name: "Temporary Redirect", description: "The request should be repeated with another URL, maintaining the original method.", useCase: "Temporary redirect preserving POST method and body." },
  { code: 308, name: "Permanent Redirect", description: "The resource has been permanently moved, maintaining the original method.", useCase: "Permanent URL change preserving POST method." },
  // 4xx Client Errors
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to client error (malformed syntax, invalid parameters).", useCase: "Invalid JSON body, missing required fields, validation errors." },
  { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or has not been provided.", useCase: "Missing or invalid authentication token/credentials." },
  { code: 402, name: "Payment Required", description: "Reserved for future use. Sometimes used for payment-related errors.", useCase: "Subscription expired, payment needed for API access." },
  { code: 403, name: "Forbidden", description: "The server understood the request but refuses to authorize it.", useCase: "Authenticated user trying to access admin-only resources." },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource.", useCase: "Invalid URL, deleted resource, wrong endpoint." },
  { code: 405, name: "Method Not Allowed", description: "The request method is known by the server but not supported for the target resource.", useCase: "Sending POST to a GET-only endpoint." },
  { code: 406, name: "Not Acceptable", description: "The server cannot produce a response matching the Accept headers.", useCase: "Requesting XML from a JSON-only API." },
  { code: 407, name: "Proxy Authentication Required", description: "Authentication with a proxy is required before accessing the resource.", useCase: "Corporate proxy requiring credentials." },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request.", useCase: "Slow client connection, network issues." },
  { code: 409, name: "Conflict", description: "The request conflicts with the current state of the server.", useCase: "Duplicate resource creation, concurrent edit conflicts." },
  { code: 410, name: "Gone", description: "The resource is no longer available and will not be available again.", useCase: "Permanently deleted content, deprecated API endpoints." },
  { code: 411, name: "Length Required", description: "The request did not specify the length of its content.", useCase: "Server requires Content-Length header for uploads." },
  { code: 412, name: "Precondition Failed", description: "Preconditions in the request headers were not met.", useCase: "Conditional requests with If-Match/If-Unmodified-Since failing." },
  { code: 413, name: "Payload Too Large", description: "The request entity is larger than the server is willing to process.", useCase: "File upload exceeding size limit." },
  { code: 414, name: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret.", useCase: "Overly long query strings." },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server.", useCase: "Sending XML when only JSON is accepted." },
  { code: 416, name: "Range Not Satisfiable", description: "The range specified by the Range header cannot be fulfilled.", useCase: "Requesting bytes beyond file size in download resumption." },
  { code: 418, name: "I'm a Teapot", description: "The server refuses the attempt to brew coffee with a teapot.", useCase: "Easter egg defined in RFC 2324." },
  { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but unable to be followed due to semantic errors.", useCase: "Validation errors in RESTful APIs." },
  { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed.", useCase: "Preventing replay attacks with TLS 1.3 early data." },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", useCase: "Rate limiting, API throttling." },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large.", useCase: "Cookies or headers exceeding size limits." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "Access to the resource is denied for legal reasons.", useCase: "Content blocked due to GDPR, DMCA, or government censorship." },
  // 5xx Server Errors
  { code: 500, name: "Internal Server Error", description: "A generic error message when the server encounters an unexpected condition.", useCase: "Unhandled exceptions, database errors, server bugs." },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality required to fulfill the request.", useCase: "Unsupported HTTP method or feature not yet built." },
  { code: 502, name: "Bad Gateway", description: "The server acting as a gateway received an invalid response from the upstream server.", useCase: "Reverse proxy (Nginx) cannot reach the application server." },
  { code: 503, name: "Service Unavailable", description: "The server is temporarily unavailable, usually due to maintenance or overloading.", useCase: "Server maintenance, traffic spikes, dependency failures." },
  { code: 504, name: "Gateway Timeout", description: "The server acting as a gateway did not receive a timely response from the upstream server.", useCase: "Upstream server taking too long to respond." },
  { code: 505, name: "HTTP Version Not Supported", description: "The server does not support the HTTP version used in the request.", useCase: "Server only supports HTTP/1.1 but client sent HTTP/2." },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", useCase: "WebDAV server running out of disk space." },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request.", useCase: "WebDAV circular references." },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", useCase: "Captive portals (hotel/airport Wi-Fi login pages)." },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "1xx": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "2xx": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "3xx": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  "4xx": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "5xx": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const categoryNames: Record<string, string> = {
  "1xx": "Informational",
  "2xx": "Success",
  "3xx": "Redirection",
  "4xx": "Client Errors",
  "5xx": "Server Errors",
};

function getCategory(code: number): string {
  return `${Math.floor(code / 100)}xx`;
}

export default function HttpStatusCodesTool() {
  const t = useTranslations("tools.http-status-codes");
  const tc = useTranslations("common");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredCodes = useMemo(() => {
    return statusCodes.filter((sc) => {
      const matchesSearch =
        !search ||
        sc.code.toString().includes(search) ||
        sc.name.toLowerCase().includes(search.toLowerCase()) ||
        sc.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || getCategory(sc.code) === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, filterCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, StatusCode[]> = {};
    filteredCodes.forEach((sc) => {
      const cat = getCategory(sc.code);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(sc);
    });
    return groups;
  }, [filteredCodes]);

  return (
    <ToolLayout toolSlug="http-status-codes">
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or description..."
            className="flex-1 bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === "all"
                  ? "bg-teal text-white"
                  : "bg-surface text-foreground hover:bg-border"
              }`}
            >
              All
            </button>
            {["1xx", "2xx", "3xx", "4xx", "5xx"].map((cat) => {
              const colors = categoryColors[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat === filterCategory ? "all" : cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === cat
                      ? `${colors.bg} ${colors.text} border ${colors.border}`
                      : "bg-surface text-foreground hover:bg-border"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredCodes.length} of {statusCodes.length} status codes
        </p>

        {/* Status codes grouped */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, codes]) => {
            const colors = categoryColors[category];
            return (
              <div key={category}>
                <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${colors.bg}`}>
                  <span className={`text-sm font-bold ${colors.text}`}>{category}</span>
                  <span className={`text-sm ${colors.text}`}>{categoryNames[category]}</span>
                  <span className={`text-xs ${colors.text} opacity-70`}>({codes.length})</span>
                </div>

                <div className="space-y-1">
                  {codes.map((sc) => {
                    const isExpanded = expanded === sc.code;
                    return (
                      <div
                        key={sc.code}
                        className={`bg-card border rounded-xl overflow-hidden transition-colors ${
                          isExpanded ? `${colors.border}` : "border-border"
                        }`}
                      >
                        <button
                          onClick={() => setExpanded(isExpanded ? null : sc.code)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface/50 transition-colors"
                        >
                          <span className={`font-mono font-bold text-sm ${colors.text} min-w-[3ch]`}>
                            {sc.code}
                          </span>
                          <span className="text-sm font-medium text-foreground flex-1">
                            {sc.name}
                          </span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</span>
                              <p className="text-sm text-foreground mt-1">{sc.description}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Common Use Case</span>
                              <p className="text-sm text-foreground mt-1">{sc.useCase}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCodes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No matching status codes found</p>
            <p className="text-sm mt-1">Try a different search term or category</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
