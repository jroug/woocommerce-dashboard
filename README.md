# E-commerce Admin Dashboard

## Overview

A basic e-commerce administration dashboard built with Next.js, presented under the Northstar Commerce demo brand. This portfolio project focuses on dashboard layout, navigation, reusable components, and everyday store-management interactions.

**The products, orders, and customers lists, plus order detail pages, read from WooCommerce.** Other pages, including the product detail editor, still use mock data. Product writes are not connected.

## Concept

The intended experience is a simplified workspace for e-commerce clients: essential information and common actions for orders, products, customers, and store performance.

The goal is not to recreate the full WordPress or WooCommerce administration interface. In a future integration, WooCommerce would remain the underlying e-commerce system and source of truth, while this application would provide a focused, client-friendly interface on top of it.

## Current Features

| Area                                 | Implemented experience                                                                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard (`/dashboard`)             | KPI cards, selectable demo periods, a revenue chart, order-status summaries, recent orders, top products, and inventory alerts.                                             |
| Orders (`/orders`)                   | Search, status/payment/date filters, sorting, pagination, and row selection.                                                                                                |
| Order details (`/orders/[id]`)       | Item and totals breakdowns, customer and address information, payment and fulfillment summaries, and a sample activity timeline.                                            |
| Products (`/products`)               | Search, category/status/inventory/price filters, sorting, pagination, and row selection.                                                                                    |
| Product details (`/products/[id]`)   | Local editing of product information, pricing, inventory, variants, shipping, SEO, categories, and tags; sample media controls, validation, and local save feedback.        |
| Customers (`/customers`)             | Summary metrics, search, segment and attribute filters, sorting, pagination, selection, and local bulk tagging/removal of records.                                          |
| Customer details (`/customers/[id]`) | Profile and address editing, order history, summary metrics, behavior information, editable tags, and local notes with timeline entries.                                    |
| Analytics (`/analytics`)             | Date-range selection, comparison display, sales/orders/AOV charts, product and category performance, customer and refund summaries, a conversion funnel, and sales sources. |

Shared UI includes responsive layouts, navigation between the main sections, loading skeletons, empty and no-results states, and missing-record views. The root route redirects to `/dashboard`.

Product saves and customer changes exist only in component state: they are not persisted or synchronized between pages. The creation routes (`/orders/new`, `/products/new`, and `/customers/new`) are placeholders. Export/import, order-management actions, and several shell controls are visual affordances without working backend workflows; settings and coupon pages are not implemented.

## Demo Data

Mock data is intentional: it allows the frontend and dashboard architecture to develop independently of a specific backend.

Fixtures live in `src/data`, with separate TypeScript models in `src/types`. Detail helpers enrich list records with illustrative information, and components receive typed data through props. These boundaries provide places to introduce API data and response mapping later; an API adapter is not implemented yet.

Demo dates are fixed to an August 2026 snapshot. Analytics combine calculations from sample orders with synthetic chart, comparison, and traffic data. Dashboard revenue fixtures use USD, while order, product, and customer views use EUR. The fixtures illustrate the UI and should not be treated as a reconciled set of store reports.

## Future WooCommerce Integration

WordPress + WooCommerce is the planned headless e-commerce backend. A future server-side integration could retrieve products, orders, customers, and analytics/reporting data through the WooCommerce REST API and map responses into the dashboard's frontend models.

The proposed flow is:

```text
Dashboard UI → Next.js server-side integration → WooCommerce REST API
```

Authorized management actions would write back to WooCommerce, keeping it the source of truth. API access, credential handling, authentication, permissions, persistence, and reporting integration are all future work. No WooCommerce connection is currently implemented.

## Tech Stack

- **Next.js 16.3.3** — App Router, page/layout components, dynamic routes, and loading UI.
- **React 19.2.8 and TypeScript 5** — components, typed data models, and local state.
- **Tailwind CSS 4 and CSS custom properties** — styling and shared design tokens.
- **Recharts 3** — dashboard and analytics charts.
- **Lucide React** — interface icons.
- **ESLint 9 and Prettier 3** — linting and formatting.

## Architecture

```text
src/
├── app/          # Routes, root layout, loading boundaries, and global styles
├── components/   # Dashboard, orders, products, customers, and analytics UI
├── data/         # Mock records, chart fixtures, and detail-building helpers
└── types/        # Frontend models for each domain
public/           # Static assets, including product illustrations
```

App Router pages compose a shared `AppShell` with feature components. Server pages look up local records for detail routes and pass data to the UI. Client Components handle filtering, sorting, selection, charts, and editable form state using React hooks.

Data models are separate from presentation, and the order, product, and customer types anticipate a future WooCommerce response mapper. Replacing fixtures will still require a data-access layer, response mapping, and changes to connect local interactions to persistent operations. There are currently no application API routes or server actions.

## Getting Started

Use Node.js **20.9 or newer** and npm. From the project directory:

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000); the application redirects to the dashboard. No backend setup, API credentials, or environment variables are required for the mock-data version.

To build and run locally in production mode:

```bash
npm run build
npm run start
```

Available quality checks:

```bash
npm run lint
npm run format:check
```

Run `npm run format` to apply Prettier formatting across the project.

## Project Status

This is a frontend portfolio implementation demonstrating the concept, UI, and component/data organization of a simplified e-commerce administration dashboard. It is not ready to administer a live store: authentication, authorization, backend integration, and durable data changes are not implemented.

## Future Improvements

Possible next steps include:

- WooCommerce API integration with typed response mapping and error handling.
- Authentication and role-based permissions for store administrators and clients.
- Live order data, refresh strategies, and webhook-driven updates.
- Persistent product creation, editing, inventory changes, and media uploads.
- Order management and fulfillment workflows.
- Persistent customer management, notes, and tags.
- Expanded analytics backed by consistent store and reporting data.
- Completion of placeholder actions and navigation controls.

## WooCommerce products connection

Set `WOOCOMMERCE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, and `WOOCOMMERCE_CONSUMER_SECRET` in `.env.local`. Use the store base URL (including any WordPress subdirectory) and keys with read access to products and store settings. Credentials stay on the server.

The products list loads every REST API page, uses the store currency, and filters locally across the full catalog. Its columns show name, SKU, stock, regular/sale price, all categories, tags, brands, WooCommerce status, and publication date. Empty values display a dash. Publication dates use the published product's `date_created_gmt` in UTC; drafts show their last modified date from `date_modified_gmt` instead. Brands require the WooCommerce API's `brands` field.

For this local MAMP installation, `.env.local` also sets `WOOCOMMERCE_LOCAL_CERT_PATH` to the MAMP localhost certificate. The connection trusts that exact certificate only for HTTPS localhost, without globally disabling TLS verification. Remove this setting when switching to a remote store with a publicly trusted certificate. Restart the dev server after changing environment settings.

The orders list fetches all WooCommerce order pages, including guest billing information, line-item quantities, order status, payment date-derived payment status, totals, and each order’s currency. Date filters use the current date. Order detail pages load the selected order and all its notes from WooCommerce. They show real line items, billing/shipping addresses, payment information, fees, refunds, and recorded creation/payment/completion dates. Missing tracking and customer lifetime metrics are not fabricated. Order actions remain unimplemented; the live detail view is read-only.

The customers list loads every page of WooCommerce’s `wc-analytics/reports/customers` report, including guest customers when present in analytics. Names, usernames, last activity, registration dates, order counts, lifetime spend, AOV, and location fields come directly from that report, respecting WooCommerce’s analytics status rules. Dates are displayed in the store’s local calendar dates. Summary cards reflect all filtered rows: customer count, mean order count, mean lifetime spend, and mean customer AOV (excluding null AOVs, as WooCommerce does). Customer detail pages load WooCommerce profiles and full order history, while retaining the same analytics metrics as the list. Guest profiles use the latest matching guest order for contact/address details. Checkout notes and recorded activity replace demo content. Customer editing and bulk actions are not connected.
