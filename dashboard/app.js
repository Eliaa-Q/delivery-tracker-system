const API_BASE = "http://localhost:3000";

const ACTION_COLORS = {
  updateDeliveryStatus: "#446085",
  detectDelay: "#32414f",
  delayAlertChain: "#ba1a1a",
  feedbackIntegration: "#7c6bb2",
  driverPerformanceMetrics: "#2b4252",
  driverDelaySpikeChain: "#c58b00",
};

const state = {
  deliveries: [],
  drivers: [],
  alerts: [],
  jobs: [],
  analytics: [],
  globalSearch: "",
  alertSearch: "",
  deliverySearch: "",
  showAllAlerts: false,
  showAllDeliveries: false,
};

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
}

function formatShortDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function prettifyAction(action) {
  return action
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function buildDonut(el, totalEl, legendEl, items) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  totalEl.textContent = total.toLocaleString();

  if (total === 0) {
    el.style.background = "#e7e7ef";
    legendEl.innerHTML = `<div class="text-sm text-slate-500">No data available</div>`;
    return;
  }

  let current = 0;
  const segments = [];

  for (const item of items) {
    const start = (current / total) * 100;
    current += item.value;
    const end = (current / total) * 100;
    segments.push(`${item.color} ${start}% ${end}%`);
  }

  el.style.background = `conic-gradient(${segments.join(", ")})`;

  legendEl.innerHTML = items
    .filter((item) => item.value > 0)
    .map((item) => {
      const percent = Math.round((item.value / total) * 100);
      return `
        <div class="legend-row">
          <div class="legend-left">
            <span class="legend-dot" style="background:${item.color}"></span>
            <span class="text-slate-800 font-medium">${item.label}</span>
          </div>
          <span class="font-bold text-slate-500">${percent}%</span>
        </div>
      `;
    })
    .join("");
}

function renderDeliveryVolume(deliveries) {
  const chart = document.getElementById("deliveryVolumeChart");
  const labels = document.getElementById("deliveryVolumeLabels");

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  deliveries.forEach((delivery) => {
    const date = new Date(delivery.createdAt || new Date().toISOString());
    const jsDay = date.getDay();
    const mapped = jsDay === 0 ? 6 : jsDay - 1;
    counts[mapped] += 1;
  });

  const max = Math.max(...counts, 1);

  chart.innerHTML = counts
    .map((count, index) => {
      const height = Math.max((count / max) * 100, count > 0 ? 18 : 8);
      const color = index === 5 ? "#446085" : "#b8c8da";
      return `<div class="flex-1 rounded-t-xl transition-all" style="height:${height}%; background:${color};"></div>`;
    })
    .join("");

  labels.innerHTML = weekdays.map((day) => `<span>${day}</span>`).join("");
}

function renderDrivers(drivers, deliveries) {
  const container = document.getElementById("driversGrid");

  const activeStatuses = ["assigned", "picked_up", "in_transit", "delayed"];
  const activeDriverIds = new Set(
    deliveries
      .filter((d) => activeStatuses.includes(d.status))
      .map((d) => d.driverId)
      .filter(Boolean),
  );

  const globalQuery = state.globalSearch.trim().toLowerCase();

  const filteredDrivers = [...drivers]
    .filter((driver) => {
      if (!globalQuery) return true;
      return (
        driver.name.toLowerCase().includes(globalQuery) ||
        (driver.phone || "").toLowerCase().includes(globalQuery) ||
        driver.id.toLowerCase().includes(globalQuery)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = filteredDrivers
    .map((driver) => {
      const rating = Number(driver.ratingAverage || 0);
      const isWarning = rating > 0 && rating < 3.5;
      const isActive = activeDriverIds.has(driver.id);

      let badgeClass = "badge--standby";
      let badgeText = "Standby";

      if (isWarning) {
        badgeClass = "badge--review";
        badgeText = "Review Req.";
      } else if (isActive) {
        badgeClass = "badge--route";
        badgeText = "On Route";
      }

      return `
        <div class="driver-card ${isWarning ? "driver-card--warning" : ""}">
          <div class="driver-avatar ${isWarning ? "driver-avatar--warning" : ""}">👤</div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-bold text-slate-900 leading-tight">${driver.name}</h4>
            <p class="text-sm text-slate-500">${driver.phone || "—"}</p>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold ${isWarning ? "text-red-600" : "text-amber-500"}">
              ★ ${rating.toFixed(1)}
            </div>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderAlerts(alerts) {
  const tbody = document.getElementById("alertsTableBody");
  const toggleBtn = document.getElementById("toggleAlertsBtn");

  const globalQuery = state.globalSearch.trim().toLowerCase();
  const localQuery = state.alertSearch.trim().toLowerCase();

  const filteredAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((alert) => {
      const source = alert.deliveryId || alert.driverId || "";
      const searchable = [
        alert.type,
        alert.message,
        source,
        alert.sourceJobId || "",
      ]
        .join(" ")
        .toLowerCase();

      const passesGlobal = !globalQuery || searchable.includes(globalQuery);
      const passesLocal = !localQuery || searchable.includes(localQuery);

      return passesGlobal && passesLocal;
    });

  const visibleAlerts = state.showAllAlerts
    ? filteredAlerts
    : filteredAlerts.slice(0, 10);

  tbody.innerHTML = visibleAlerts
    .map((alert) => {
      const isDelay = alert.type === "delay_alert";
      const isEscalation = alert.type === "driver_escalation";
      const color = isDelay ? "#ba1a1a" : isEscalation ? "#c58b00" : "#446085";
      const label = isDelay
        ? "Delayed"
        : isEscalation
          ? "Driver Escalation"
          : "System";

      const source = alert.deliveryId
        ? `Delivery ${alert.deliveryId.slice(0, 8)}...`
        : alert.driverId
          ? `Driver ${alert.driverId.slice(0, 8)}...`
          : "System";

      return `
        <tr class="table-row-soft hover:bg-[#f7f7fb] transition-colors">
          <td class="px-6 py-4 font-medium whitespace-nowrap">${formatTime(alert.createdAt)}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center gap-2 font-bold" style="color:${color}">
              <span class="w-2 h-2 rounded-full" style="background:${color}"></span>
              ${label}
            </span>
          </td>
          <td class="px-6 py-4 text-slate-500">${source}</td>
          <td class="px-6 py-4 text-slate-600">${alert.message}</td>
        </tr>
      `;
    })
    .join("");

  if (toggleBtn) {
    if (filteredAlerts.length <= 10) {
      toggleBtn.style.display = "none";
    } else {
      toggleBtn.style.display = "inline-block";
      toggleBtn.textContent = state.showAllAlerts ? "Show Less" : "Show All";
    }
  }
}

function renderDeliveries(deliveries, drivers) {
  const tbody = document.getElementById("deliveriesTableBody");
  const toggleBtn = document.getElementById("toggleDeliveriesBtn");
  const driverMap = new Map(drivers.map((driver) => [driver.id, driver]));

  const globalQuery = state.globalSearch.trim().toLowerCase();
  const localQuery = state.deliverySearch.trim().toLowerCase();

  const filteredDeliveries = [...deliveries]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .filter((delivery) => {
      const driver = delivery.driverId
        ? driverMap.get(delivery.driverId)
        : null;

      const searchable = [
        delivery.id,
        delivery.status,
        delivery.driverId || "",
        driver ? driver.name : "",
        driver ? driver.phone || "" : "",
      ]
        .join(" ")
        .toLowerCase();

      const passesGlobal = !globalQuery || searchable.includes(globalQuery);
      const passesLocal = !localQuery || searchable.includes(localQuery);

      return passesGlobal && passesLocal;
    });

  const visibleDeliveries = state.showAllDeliveries
    ? filteredDeliveries
    : filteredDeliveries.slice(0, 10);

  tbody.innerHTML = visibleDeliveries
    .map((delivery) => {
      const driver = delivery.driverId
        ? driverMap.get(delivery.driverId)
        : null;
      return `
        <tr class="table-row-soft hover:bg-[#f7f7fb] transition-colors">
          <td class="px-6 py-5 font-bold text-primary">#${delivery.id.slice(0, 8)}</td>
          <td class="px-6 py-5">
            <div class="flex flex-col">
              <span class="font-semibold text-slate-900">${driver ? driver.name : "Unassigned"}</span>
              <span class="text-xs text-slate-500">${driver ? driver.phone || "No phone" : "No phone"}</span>
            </div>
          </td>
          <td class="px-6 py-5">
            <span class="status-badge status-${delivery.status}">
              ${delivery.status.replace("_", " ")}
            </span>
          </td>
          <td class="px-6 py-5 text-slate-500">${formatShortDate(delivery.eta)}</td>
         
        </tr>
      `;
    })
    .join("");

  if (toggleBtn) {
    if (filteredDeliveries.length <= 10) {
      toggleBtn.style.display = "none";
    } else {
      toggleBtn.style.display = "inline-block";
      toggleBtn.textContent = state.showAllDeliveries
        ? "Show Less"
        : "Show All";
    }
  }
}

function renderMetrics(jobs, deliveries) {
  const running = jobs.filter((job) => job.status === "processing").length;
  const pending = jobs.filter((job) => job.status === "pending").length;
  const completed = jobs.filter((job) => job.status === "completed").length;

  document.getElementById("runningJobsValue").textContent =
    running.toLocaleString();
  document.getElementById("pendingJobsValue").textContent =
    pending.toLocaleString();
  document.getElementById("completedJobsValue").textContent =
    completed.toLocaleString();

  const totalJobs = jobs.length || 1;
  const efficiency = Math.round((completed / totalJobs) * 1000) / 10;
  document.getElementById("efficiencyValue").textContent = `${efficiency}%`;

  const statusCounts = {
    running: deliveries.filter((d) =>
      ["assigned", "picked_up", "in_transit"].includes(d.status),
    ).length,
    pending: deliveries.filter((d) => d.status === "new").length,
    completed: deliveries.filter((d) => d.status === "delivered").length,
    delayed: deliveries.filter((d) => d.status === "delayed").length,
    canceled: deliveries.filter((d) => d.status === "canceled").length,
  };

  buildDonut(
    document.getElementById("statusDonut"),
    document.getElementById("statusDonutTotal"),
    document.getElementById("statusLegend"),
    [
      { label: "Running", value: statusCounts.running, color: "#446085" },
      { label: "Pending", value: statusCounts.pending, color: "#facc15" },
      { label: "Completed", value: statusCounts.completed, color: "#32414f" },
      { label: "Delayed", value: statusCounts.delayed, color: "#ba1a1a" },
      { label: "Canceled", value: statusCounts.canceled, color: "#bdbdbd" },
    ],
  );

  const runningByActionMap = new Map();

  jobs
    .filter((job) => job.status === "pending" || job.status === "processing")
    .forEach((job) => {
      runningByActionMap.set(
        job.jobType,
        (runningByActionMap.get(job.jobType) || 0) + 1,
      );
    });

  const actionItems = Array.from(runningByActionMap.entries()).map(
    ([jobType, value]) => ({
      label: prettifyAction(jobType),
      value,
      color: ACTION_COLORS[jobType] || "#74777c",
    }),
  );

  buildDonut(
    document.getElementById("actionDonut"),
    document.getElementById("actionDonutTotal"),
    document.getElementById("actionLegend"),
    actionItems,
  );
}

function renderDashboard() {
  renderDeliveryVolume(state.deliveries);
  renderDrivers(state.drivers, state.deliveries);
  renderAlerts(state.alerts);
  renderDeliveries(state.deliveries, state.drivers);
  renderMetrics(state.jobs, state.deliveries);
}

function setupInteractions() {
  const globalSearch = document.getElementById("globalSearch");
  const alertSearch = document.getElementById("alertSearch");
  const deliverySearch = document.getElementById("deliverySearch");
  const toggleAlertsBtn = document.getElementById("toggleAlertsBtn");
  const toggleDeliveriesBtn = document.getElementById("toggleDeliveriesBtn");

  if (globalSearch) {
    globalSearch.addEventListener("input", (event) => {
      state.globalSearch = event.target.value;
      renderDashboard();
    });
  }

  if (alertSearch) {
    alertSearch.addEventListener("input", (event) => {
      state.alertSearch = event.target.value;
      renderDashboard();
    });
  }

  if (deliverySearch) {
    deliverySearch.addEventListener("input", (event) => {
      state.deliverySearch = event.target.value;
      renderDashboard();
    });
  }

  if (toggleAlertsBtn) {
    toggleAlertsBtn.addEventListener("click", () => {
      state.showAllAlerts = !state.showAllAlerts;
      renderDashboard();
    });
  }

  if (toggleDeliveriesBtn) {
    toggleDeliveriesBtn.addEventListener("click", () => {
      state.showAllDeliveries = !state.showAllDeliveries;
      renderDashboard();
    });
  }
}

async function loadDashboard() {
  try {
    const [deliveries, drivers, alerts, jobs] = await Promise.all([
      fetchJson("/deliveries"),
      fetchJson("/drivers"),
      fetchJson("/alerts"),
      fetchJson("/jobs"),
    ]);

    state.deliveries = deliveries;
    state.drivers = drivers;
    state.alerts = alerts;
    state.jobs = jobs;

    renderDashboard();
  } catch (error) {
    console.error(error);
  }
}

setupInteractions();
loadDashboard();
setInterval(loadDashboard, 15000);
