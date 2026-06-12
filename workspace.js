(() => {
  const { useEffect, useMemo, useRef, useState } = React;
  const CURRENT_USER = {
    name: "Creator 2",
    role: "Engineering Creator",
    initials: "C2",
    color: "#C47ACD"
  };
  const USERS = [
    { name: "Creator 1", role: "Engineering Creator", initials: "C1", color: "#D7A3DC" },
    { name: "Creator 2", role: "Engineering Creator", initials: "C2", color: "#C47ACD" },
    { name: "Creator 3", role: "Engineering Creator", initials: "C3", color: "#B45CC2" },
    { name: "Reviewer 1", role: "Engineering Reviewer", initials: "R1", color: "#E983B9" },
    { name: "Reviewer 2", role: "Engineering Reviewer", initials: "R2", color: "#6B8FF0" },
    { name: "Approver 1", role: "Approval Desk", initials: "A1", color: "#28A874" }
  ];
  const ZONES = [
    {
      code: "SCR",
      label: "South Central Railway",
      divisions: [
        {
          code: "NED",
          label: "Nanded",
          sections: [
            {
              code: "AWB-AK",
              label: "Aurangabad - Ankai",
              stations: [
                { code: "AWB", label: "Aurangabad" },
                { code: "NED", label: "Nanded" },
                { code: "J", label: "Jalna" }
              ]
            },
            {
              code: "PAU-PBN",
              label: "Purna - Parbhani",
              stations: [
                { code: "PAU", label: "Purna" },
                { code: "PBN", label: "Parbhani" },
                { code: "SELU", label: "Selu" }
              ]
            }
          ]
        },
        {
          code: "HYB",
          label: "Hyderabad",
          sections: [
            {
              code: "HYB-LPI",
              label: "Hyderabad - Lingampalli",
              stations: [
                { code: "HYB", label: "Hyderabad" },
                { code: "LPI", label: "Lingampalli" },
                { code: "SC", label: "Secunderabad" }
              ]
            },
            {
              code: "KZJ-WL",
              label: "Kazipet - Warangal",
              stations: [
                { code: "KZJ", label: "Kazipet" },
                { code: "WGL", label: "Warangal" },
                { code: "WL", label: "Warangal East" }
              ]
            }
          ]
        }
      ]
    },
    {
      code: "CR",
      label: "Central Railway",
      divisions: [
        {
          code: "PUNE",
          label: "Pune",
          sections: [
            {
              code: "PUNE-LNL",
              label: "Pune - Lonavala",
              stations: [
                { code: "PUNE", label: "Pune" },
                { code: "LNL", label: "Lonavala" },
                { code: "KAD", label: "Khadki" }
              ]
            }
          ]
        }
      ]
    }
  ];
  const DOCUMENT_TYPES = ["ESP", "SIP", "LOP"];
  const STAGES = [
    "Returned with Comments",
    "In Editing",
    "Under Review",
    "Draft / WIP",
    "Submitted",
    "Assigned",
    "Validation Pending"
  ];
  const VALIDATIONS = ["Passed", "Warning", "Failed", "Not Run"];
  const SAMPLE_ROWS = [
    {
      id: "DOC-001",
      bucket: "my",
      zone: "SCR",
      division: "NED",
      section: "AWB-AK",
      station: "Aurangabad",
      stationCode: "AWB",
      documentType: "ESP",
      version: "V3-R0-A0",
      stage: "Returned with Comments",
      issues: 5,
      validation: "Failed",
      assignedTo: USERS[1],
      drawingNo: "GM(W)SC/YARDS/NED/AWB/431/2023",
      initiatedBy: "Creator 1",
      initiatedOn: "05 Jun 2026",
      previousAssignee: "Creator 1",
      sourceFile: "AWB-ESP-2025-V7-R0-A0.pdf",
      lastActivity: "Returned by Engineering Reviewer",
      lastUpdated: "10 Jun 2026, 04:30 PM",
      openComments: 3,
      validationIssues: 2
    },
    {
      id: "DOC-002",
      bucket: "my",
      zone: "SCR",
      division: "NED",
      section: "AWB-AK",
      station: "Nanded",
      stationCode: "NED",
      documentType: "ESP",
      version: "V2-R0-A0",
      stage: "In Editing",
      issues: 2,
      validation: "Warning",
      assignedTo: USERS[0],
      drawingNo: "GM(W)SC/YARDS/NED/NED/118/2024",
      initiatedBy: "Creator 1",
      initiatedOn: "03 Jun 2026",
      previousAssignee: "Creator 2",
      sourceFile: "NED-ESP-2025-V2-R0-A0.pdf",
      lastActivity: "Creator updated platform geometry",
      lastUpdated: "10 Jun 2026, 02:10 PM",
      openComments: 2,
      validationIssues: 1
    },
    {
      id: "DOC-003",
      bucket: "my",
      zone: "SCR",
      division: "HYB",
      section: "HYB-LPI",
      station: "Hyderabad",
      stationCode: "HYB",
      documentType: "SIP",
      version: "V4-R1-A0",
      stage: "Under Review",
      issues: 1,
      validation: "Passed",
      assignedTo: USERS[3],
      drawingNo: "GM(W)SC/SIP/HYB/214/2025",
      initiatedBy: "Creator 2",
      initiatedOn: "01 Jun 2026",
      previousAssignee: "Creator 3",
      sourceFile: "HYB-SIP-2026-V4-R1-A0.pdf",
      lastActivity: "Sent to engineering review",
      lastUpdated: "09 Jun 2026, 06:20 PM",
      openComments: 1,
      validationIssues: 0
    },
    {
      id: "DOC-004",
      bucket: "my",
      zone: "SCR",
      division: "HYB",
      section: "HYB-LPI",
      station: "Lingampalli",
      stationCode: "LPI",
      documentType: "ESP",
      version: "V1-R0-A0",
      stage: "Draft / WIP",
      issues: 0,
      validation: "Not Run",
      assignedTo: null,
      drawingNo: "GM(W)SC/YARDS/HYB/LPI/077/2025",
      initiatedBy: "Creator 3",
      initiatedOn: "07 Jun 2026",
      previousAssignee: "-",
      sourceFile: "LPI-ESP-2025-V1-R0-A0.dwg",
      lastActivity: "Created from source ESP",
      lastUpdated: "08 Jun 2026, 11:15 AM",
      openComments: 0,
      validationIssues: 0
    },
    {
      id: "DOC-005",
      bucket: "my",
      zone: "SCR",
      division: "HYB",
      section: "KZJ-WL",
      station: "Warangal",
      stationCode: "WGL",
      documentType: "LOP",
      version: "V2-R0-A0",
      stage: "Submitted",
      issues: 0,
      validation: "Passed",
      assignedTo: USERS[2],
      drawingNo: "GM(W)SC/LOP/HYB/WGL/052/2026",
      initiatedBy: "Creator 3",
      initiatedOn: "02 Jun 2026",
      previousAssignee: "Creator 2",
      sourceFile: "WGL-LOP-2026-V2-R0-A0.pdf",
      lastActivity: "Submitted for approval",
      lastUpdated: "08 Jun 2026, 09:40 AM",
      openComments: 0,
      validationIssues: 0
    }
  ];
  const STATION_POOL = ZONES.flatMap(
    (zone) => zone.divisions.flatMap(
      (division) => division.sections.flatMap(
        (section) => section.stations.map((station) => ({
          zone: zone.code,
          division: division.code,
          section: section.code,
          sectionLabel: section.label,
          station: station.label,
          stationCode: station.code
        }))
      )
    )
  );
  const makeRows = () => {
    const rows = [...SAMPLE_ROWS];
    for (let index = rows.length; index < 126; index += 1) {
      const station = STATION_POOL[index % STATION_POOL.length];
      const documentType = DOCUMENT_TYPES[index % DOCUMENT_TYPES.length];
      const stage = STAGES[index % STAGES.length];
      const validation = stage === "Draft / WIP" ? "Not Run" : VALIDATIONS[index % VALIDATIONS.length];
      const bucket = index < 12 ? "my" : index < 108 ? "team" : "unassigned";
      const assignee = bucket === "unassigned" || index % 13 === 0 ? null : USERS[index % USERS.length];
      rows.push({
        id: `DOC-${String(index + 1).padStart(3, "0")}`,
        bucket,
        zone: station.zone,
        division: station.division,
        section: station.section,
        station: station.station,
        stationCode: station.stationCode,
        documentType,
        version: `V${index % 5 + 1}-R${index % 2}-A0`,
        stage,
        issues: validation === "Failed" ? index % 6 + 1 : validation === "Warning" ? index % 3 + 1 : 0,
        validation,
        assignedTo: assignee,
        drawingNo: `GM(W)SC/YARDS/${station.division}/${station.stationCode}/${String(200 + index)}/2026`,
        initiatedBy: USERS[(index + 1) % USERS.length].name,
        initiatedOn: `${String(index % 18 + 1).padStart(2, "0")} Jun 2026`,
        previousAssignee: USERS[(index + 2) % USERS.length].name,
        sourceFile: `${station.stationCode}-${documentType}-2026-${String(index + 1).padStart(3, "0")}.pdf`,
        lastActivity: stage === "Returned with Comments" ? "Returned by Engineering Reviewer" : "Updated in document workflow",
        lastUpdated: `${String(index % 18 + 1).padStart(2, "0")} Jun 2026, ${String(9 + index % 9).padStart(2, "0")}:${index % 2 ? "45" : "10"} ${index % 3 ? "AM" : "PM"}`,
        openComments: validation === "Failed" ? index % 4 + 1 : index % 3,
        validationIssues: validation === "Failed" ? index % 5 + 1 : validation === "Warning" ? 1 : 0
      });
    }
    return rows;
  };
  const INITIAL_ROWS = makeRows();
  const allZoneOptions = ZONES.map((zone) => ({ value: zone.code, label: zone.code }));
  const getDivisionOptions = (zoneValue) => {
    const zones = zoneValue === "all" ? ZONES : ZONES.filter((zone) => zone.code === zoneValue);
    return zones.flatMap((zone) => zone.divisions.map((division) => ({ value: division.code, label: `${division.label} Division` })));
  };
  const getSectionOptions = (zoneValue, divisionValue) => {
    const zones = zoneValue === "all" ? ZONES : ZONES.filter((zone) => zone.code === zoneValue);
    return zones.flatMap(
      (zone) => zone.divisions.filter((division) => divisionValue === "all" || division.code === divisionValue).flatMap((division) => division.sections.map((section) => ({ value: section.code, label: section.label })))
    );
  };
  const getStationOptions = (zoneValue, divisionValue, sectionValue) => {
    const zones = zoneValue === "all" ? ZONES : ZONES.filter((zone) => zone.code === zoneValue);
    return zones.flatMap(
      (zone) => zone.divisions.filter((division) => divisionValue === "all" || division.code === divisionValue).flatMap(
        (division) => division.sections.filter((section) => sectionValue === "all" || section.code === sectionValue).flatMap((section) => section.stations.map((station) => ({ value: station.code, label: `${station.label} (${station.code})` })))
      )
    );
  };
  const stageTone = (stage) => {
    if (stage === "Returned with Comments") return "danger";
    if (stage === "Submitted" || stage === "Assigned") return "warning";
    if (stage === "Draft / WIP") return "neutral";
    return "info";
  };
  const validationTone = (validation) => {
    if (validation === "Passed") return "success";
    if (validation === "Warning") return "warning";
    if (validation === "Failed") return "danger";
    return "neutral";
  };
  const SortTh = ({ children, sortKey, sort, onSort, style }) => {
    const active = sort.key === sortKey;
    return /* @__PURE__ */ React.createElement("th", { "data-sortable": "true", "data-active": active ? "true" : void 0, onClick: () => onSort(sortKey), style }, /* @__PURE__ */ React.createElement("span", { className: "ds-th-inner" }, children, /* @__PURE__ */ React.createElement(Icon, { name: active ? sort.dir === "asc" ? "arrow_up" : "arrow_down" : "sort", size: 11, style: !active ? { opacity: 0.35 } : void 0 })));
  };
  const StageChip = ({ stage }) => /* @__PURE__ */ React.createElement(Chip, { tone: stageTone(stage), leadingIcon: stage === "Returned with Comments" ? "alert" : void 0 }, stage);
  const ValidationChip = ({ validation }) => {
    const icon = validation === "Passed" ? "check_circle" : validation === "Warning" ? "alert_tri" : validation === "Failed" ? "x" : "minus";
    return /* @__PURE__ */ React.createElement(Chip, { tone: validationTone(validation), leadingIcon: icon }, validation);
  };
  const TypePill = ({ type }) => /* @__PURE__ */ React.createElement("span", { className: "ws-type-pill", "data-type": type }, type);
  const AssigneeCell = ({ user }) => {
    if (!user) {
      return /* @__PURE__ */ React.createElement("span", { className: "ws-assignee" }, /* @__PURE__ */ React.createElement("span", { className: "ws-avatar ws-avatar-empty" }, /* @__PURE__ */ React.createElement(Icon, { name: "users", size: 12 })), /* @__PURE__ */ React.createElement("span", null, "Unassigned"));
    }
    return /* @__PURE__ */ React.createElement("span", { className: "ws-assignee" }, /* @__PURE__ */ React.createElement("span", { className: "ws-avatar", style: { background: user.color } }, user.initials), /* @__PURE__ */ React.createElement("span", null, user.name));
  };
  const DetailRow = ({ item }) => {
    const details = [
      ["Drawing No.", item.drawingNo],
      ["Initiated By", item.initiatedBy],
      ["Previous Assignee", item.previousAssignee],
      ["Open Comments", String(item.openComments)],
      ["Division", item.division],
      ["Initiated On", item.initiatedOn],
      ["Source File", item.sourceFile],
      ["Validation Issues", String(item.validationIssues)],
      ["Section", item.section],
      ["Last Updated", item.lastUpdated],
      ["Last Activity", item.lastActivity]
    ];
    return /* @__PURE__ */ React.createElement("tr", { className: "ws-detail-row" }, /* @__PURE__ */ React.createElement("td", { colSpan: "8" }, /* @__PURE__ */ React.createElement("div", { className: "ws-detail-grid" }, details.map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "ws-detail-item", key: `${label}-${value}` }, /* @__PURE__ */ React.createElement("span", null, label), /* @__PURE__ */ React.createElement("strong", null, value))))));
  };
  const WorkspaceEmptyState = ({ onClear }) => /* @__PURE__ */ React.createElement("div", { className: "ds-empty" }, /* @__PURE__ */ React.createElement("div", { className: "ds-empty-art" }, /* @__PURE__ */ React.createElement(Icon, { name: "search", size: 46 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ds-empty-title" }, "No documents found"), /* @__PURE__ */ React.createElement("div", { className: "ds-empty-desc", style: { marginTop: 6 } }, "No Workspace documents match the selected filters.")), /* @__PURE__ */ React.createElement("div", { className: "ds-empty-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClear }, "Clear Filters")));
  const RowActions = ({ item, onOpen, onAssign, onToast }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const needsAssignment = !item.assignedTo;
    useEffect(() => {
      if (!open) return void 0;
      const close = (event) => {
        if (ref.current && !ref.current.contains(event.target)) setOpen(false);
      };
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }, [open]);
    return /* @__PURE__ */ React.createElement("div", { className: "dl-row-actions", ref }, /* @__PURE__ */ React.createElement("button", { className: "dl-row-view-btn", onClick: () => needsAssignment ? onAssign(item) : onOpen(item) }, needsAssignment ? "Assign" : "Open"), /* @__PURE__ */ React.createElement("div", { className: "dl-row-more-wrap" }, /* @__PURE__ */ React.createElement("button", { className: "dl-action-icon", title: "More actions", onClick: () => setOpen((value) => !value) }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 14 })), open && /* @__PURE__ */ React.createElement("div", { className: "dl-row-menu" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setOpen(false);
      onOpen(item);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: "eye", size: 14 }), "View details"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setOpen(false);
      onAssign(item);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: "users", size: 14 }), needsAssignment ? "Assign" : "Reassign"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setOpen(false);
      onToast(`Cloned ${item.stationCode} ${item.documentType}`);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: "copy", size: 14 }), "Clone"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setOpen(false);
      onToast(`Export queued for ${item.stationCode}`);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: "download", size: 14 }), "Export"))));
  };
  const AssignModal = ({ item, onClose, onSave }) => {
    var _a;
    const [assignee, setAssignee] = useState(((_a = item.assignedTo) == null ? void 0 : _a.name) || CURRENT_USER.name);
    const [priority, setPriority] = useState(item.issues > 2 ? "High" : "Medium");
    const [dueDate, setDueDate] = useState("2026-06-18");
    const [notes, setNotes] = useState("");
    useEffect(() => {
      const onKey = (event) => {
        if (event.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);
    const save = () => {
      const selectedUser = USERS.find((user) => user.name === assignee) || USERS[1];
      onSave({
        ...item,
        assignedTo: selectedUser,
        stage: item.stage === "Draft / WIP" ? "In Editing" : item.stage,
        lastActivity: notes || `Assigned to ${selectedUser.name}`,
        lastUpdated: "12 Jun 2026, 08:45 AM"
      });
    };
    return ReactDOM.createPortal(
      /* @__PURE__ */ React.createElement("div", { className: "dl-add-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "dl-add-modal", onClick: (event) => event.stopPropagation(), role: "dialog", "aria-modal": "true", "aria-labelledby": "ws-assign-title" }, /* @__PURE__ */ React.createElement("div", { className: "dl-add-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "dl-add-title", id: "ws-assign-title" }, "Assign Document"), /* @__PURE__ */ React.createElement("div", { className: "dl-add-subtitle" }, item.station, " (", item.stationCode, ") - ", item.documentType, " ", item.version)), /* @__PURE__ */ React.createElement("button", { className: "dl-add-close", onClick: onClose, "aria-label": "Close" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 15 }))), /* @__PURE__ */ React.createElement("div", { className: "ws-modal-summary" }, /* @__PURE__ */ React.createElement(TypePill, { type: item.documentType }), /* @__PURE__ */ React.createElement(StageChip, { stage: item.stage }), /* @__PURE__ */ React.createElement(ValidationChip, { validation: item.validation })), /* @__PURE__ */ React.createElement("div", { className: "dl-add-body ws-assign-body" }, /* @__PURE__ */ React.createElement("div", { className: "dl-add-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", null, "Assign To"), /* @__PURE__ */ React.createElement("select", { value: assignee, onChange: (event) => setAssignee(event.target.value) }, USERS.map((user) => /* @__PURE__ */ React.createElement("option", { key: user.name, value: user.name }, user.name, " - ", user.role)))), /* @__PURE__ */ React.createElement("div", { className: "dl-add-field" }, /* @__PURE__ */ React.createElement("label", null, "Priority"), /* @__PURE__ */ React.createElement("select", { value: priority, onChange: (event) => setPriority(event.target.value) }, /* @__PURE__ */ React.createElement("option", null, "Low"), /* @__PURE__ */ React.createElement("option", null, "Medium"), /* @__PURE__ */ React.createElement("option", null, "High"), /* @__PURE__ */ React.createElement("option", null, "Critical"))), /* @__PURE__ */ React.createElement("div", { className: "dl-add-field" }, /* @__PURE__ */ React.createElement("label", null, "Due Date"), /* @__PURE__ */ React.createElement("input", { type: "date", value: dueDate, onChange: (event) => setDueDate(event.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "dl-add-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", null, "Notes / Instructions"), /* @__PURE__ */ React.createElement("textarea", { value: notes, onChange: (event) => setNotes(event.target.value), placeholder: "Add handoff notes for the assignee..." }))), /* @__PURE__ */ React.createElement("div", { className: "dl-add-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "users", onClick: save }, "Assign")))),
      document.body
    );
  };
  const WorkspacePage = ({ onNavigate }) => {
    const [items, setItems] = useState(INITIAL_ROWS);
    const [activeTab, setActiveTab] = useState("my");
    const [zone, setZone] = useState("all");
    const [division, setDivision] = useState("all");
    const [section, setSection] = useState("all");
    const [station, setStation] = useState("all");
    const [docTypes, setDocTypes] = useState(DOCUMENT_TYPES);
    const [stage, setStage] = useState("all");
    const [validation, setValidation] = useState("all");
    const [assignee, setAssignee] = useState("all");
    const [search, setSearch] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [sort, setSort] = useState({ key: "station", dir: "asc" });
    const [expanded, setExpanded] = useState("DOC-001");
    const [assignItem, setAssignItem] = useState(null);
    const [toast, setToast] = useState("");
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const divisionOptions = useMemo(() => getDivisionOptions(zone), [zone]);
    const sectionOptions = useMemo(() => getSectionOptions(zone, division), [zone, division]);
    const stationOptions = useMemo(() => getStationOptions(zone, division, section), [zone, division, section]);
    const showToast = (message) => {
      setToast(message);
      window.setTimeout(() => setToast(""), 2400);
    };
    const resetFilters = () => {
      setZone("all");
      setDivision("all");
      setSection("all");
      setStation("all");
      setDocTypes(DOCUMENT_TYPES);
      setStage("all");
      setValidation("all");
      setAssignee("all");
      setSearch("");
      setCurrentPage(1);
    };
    const tabCounts = useMemo(() => ({
      my: 12,
      team: 96,
      unassigned: 18
    }), []);
    const queueItems = [
      { id: "my", label: "My Work", count: tabCounts.my },
      { id: "team", label: "Team Queue", count: tabCounts.team },
      { id: "unassigned", label: "Unassigned", count: tabCounts.unassigned }
    ];
    const filteredItems = useMemo(() => {
      const q = search.trim().toLowerCase();
      const valueForSort = (item, key) => {
        var _a;
        if (key === "assignedTo") return ((_a = item.assignedTo) == null ? void 0 : _a.name) || "Unassigned";
        return item[key];
      };
      return items.filter((item) => item.bucket === activeTab).filter((item) => zone === "all" || item.zone === zone).filter((item) => division === "all" || item.division === division).filter((item) => section === "all" || item.section === section).filter((item) => station === "all" || item.stationCode === station).filter((item) => docTypes.includes(item.documentType)).filter((item) => stage === "all" || item.stage === stage).filter((item) => validation === "all" || item.validation === validation).filter((item) => {
        var _a;
        return assignee === "all" || (assignee === "unassigned" ? !item.assignedTo : ((_a = item.assignedTo) == null ? void 0 : _a.name) === assignee);
      }).filter((item) => {
        var _a;
        if (!q) return true;
        return [
          item.station,
          item.stationCode,
          item.documentType,
          item.version,
          item.stage,
          item.validation,
          ((_a = item.assignedTo) == null ? void 0 : _a.name) || "Unassigned",
          item.drawingNo,
          item.sourceFile
        ].join(" ").toLowerCase().includes(q);
      }).sort((a, b) => {
        const av = valueForSort(a, sort.key);
        const bv = valueForSort(b, sort.key);
        const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av || "").localeCompare(String(bv || ""), void 0, { numeric: true });
        return sort.dir === "asc" ? result : -result;
      });
    }, [activeTab, assignee, division, docTypes, items, search, section, sort, stage, station, validation, zone]);
    useEffect(() => {
      setCurrentPage(1);
    }, [activeTab, assignee, division, docTypes, pageSize, search, section, stage, station, validation, zone]);
    const activeFilterChips = useMemo(() => {
      const chips = [];
      if (docTypes.length !== DOCUMENT_TYPES.length) chips.push({ key: "docTypes", label: `Types: ${docTypes.join(", ")}` });
      if (stage !== "all") chips.push({ key: "stage", label: `Stage: ${stage}` });
      if (validation !== "all") chips.push({ key: "validation", label: `Validation: ${validation}` });
      if (assignee !== "all") chips.push({ key: "assignee", label: assignee === "unassigned" ? "Unassigned" : `Assignee: ${assignee}` });
      if (search.trim()) chips.push({ key: "search", label: `Search: ${search.trim()}` });
      return chips;
    }, [assignee, docTypes, search, stage, validation]);
    const removeFilterChip = (key) => {
      if (key === "docTypes") setDocTypes(DOCUMENT_TYPES);
      if (key === "stage") setStage("all");
      if (key === "validation") setValidation("all");
      if (key === "assignee") setAssignee("all");
      if (key === "search") setSearch("");
    };
    const handleSort = (key) => {
      setSort((current) => ({
        key,
        dir: current.key === key && current.dir === "asc" ? "desc" : "asc"
      }));
    };
    const saveAssignment = (updated) => {
      setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
      setAssignItem(null);
      showToast(`${updated.stationCode} assigned to ${updated.assignedTo.name}`);
    };
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = (safeCurrentPage - 1) * pageSize;
    const pageEnd = Math.min(pageStart + pageSize, filteredItems.length);
    const pagedItems = filteredItems.slice(pageStart, pageEnd);
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);
    const scopePath = [
      zone === "all" ? "All Zones" : zone,
      division === "all" ? "All Divisions" : division,
      section === "all" ? "All Sections" : section,
      station === "all" ? "All Stations" : station
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "dl-content ws-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: [
          { label: "Home", onClick: () => onNavigate && onNavigate("home") },
          "Workspace"
        ],
        searchPlaceholder: "Search stations, documents, approvals..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dl-page-header" }, /* @__PURE__ */ React.createElement("div", { className: "dl-page-icon-badge" }, /* @__PURE__ */ React.createElement(Icon, { name: "inbox", size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "dl-page-heading" }, /* @__PURE__ */ React.createElement("div", { className: "dl-page-title" }, "Workspace"), /* @__PURE__ */ React.createElement("div", { className: "dl-page-sub" }, "Manage documents currently being edited, reviewed, or prepared for approval.")), /* @__PURE__ */ React.createElement("div", { className: "dl-page-actions" }, /* @__PURE__ */ React.createElement("div", { className: "ws-active-docs" }, /* @__PURE__ */ React.createElement(Icon, { name: "file", size: 17 }), /* @__PURE__ */ React.createElement("strong", null, "126"), /* @__PURE__ */ React.createElement("span", null, "Active Documents")), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "refresh", onClick: () => showToast("Workspace refreshed") }, "Refresh"))), /* @__PURE__ */ React.createElement("div", { className: "dl-scope-bar ws-scope-bar" }, /* @__PURE__ */ React.createElement("span", { className: "dl-scope-label" }, "Queue:"), /* @__PURE__ */ React.createElement("div", { className: "ws-queue-tabs" }, queueItems.map((item) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item.id,
        className: "dl-bulk-row-tab",
        "data-active": activeTab === item.id ? "true" : "false",
        onClick: () => setActiveTab(item.id)
      },
      item.label,
      /* @__PURE__ */ React.createElement("span", { className: "ws-queue-count" }, item.count)
    ))), /* @__PURE__ */ React.createElement("div", { className: "dl-vdivider" }), /* @__PURE__ */ React.createElement("span", { className: "dl-scope-label" }, "Scope:"), /* @__PURE__ */ React.createElement("div", { className: "dl-scope-controls" }, /* @__PURE__ */ React.createElement("select", { className: "dl-scope-select", value: zone, onChange: (event) => {
      setZone(event.target.value);
      setDivision("all");
      setSection("all");
      setStation("all");
    } }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Zones"), allZoneOptions.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value }, option.label))), /* @__PURE__ */ React.createElement("select", { className: "dl-scope-select", value: division, onChange: (event) => {
      setDivision(event.target.value);
      setSection("all");
      setStation("all");
    } }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Divisions"), divisionOptions.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value }, option.label))), /* @__PURE__ */ React.createElement("select", { className: "dl-scope-select", value: section, onChange: (event) => {
      setSection(event.target.value);
      setStation("all");
    } }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Sections"), sectionOptions.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value }, option.label))), /* @__PURE__ */ React.createElement("select", { className: "dl-scope-select", value: station, onChange: (event) => setStation(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Stations"), stationOptions.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value }, option.label)))), /* @__PURE__ */ React.createElement("div", { className: "dl-vdivider" }), /* @__PURE__ */ React.createElement("span", { className: "dl-scope-count" }, filteredItems.length, " documents"), /* @__PURE__ */ React.createElement("nav", { className: "ds-breadcrumb dl-scope-path", style: { fontSize: "12px" } }, scopePath.map((part, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: `${part}-${index}` }, index > 0 && /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 11, className: "ds-breadcrumb-sep" }), index === scopePath.length - 1 ? /* @__PURE__ */ React.createElement("span", { className: "ds-breadcrumb-current", style: { fontSize: "12px" } }, part) : /* @__PURE__ */ React.createElement("a", { style: { fontSize: "12px" } }, part))))), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-bar" }, /* @__PURE__ */ React.createElement("div", { className: "dl-filter-row" }, /* @__PURE__ */ React.createElement("div", { className: "dl-search-wrap" }, /* @__PURE__ */ React.createElement(Icon, { name: "search", size: 14, className: "dl-search-icon" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        placeholder: "Search by station, document, version, or assignee...",
        value: search,
        onChange: (event) => setSearch(event.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-shell" }, /* @__PURE__ */ React.createElement(
      Btn,
      {
        variant: "secondary",
        size: "sm",
        leadingIcon: "filter",
        trailingIcon: filtersOpen ? "chevron_up" : "chevron_down",
        onClick: () => setFiltersOpen((open) => !open)
      },
      "Filters",
      activeFilterChips.length ? ` (${activeFilterChips.length})` : ""
    ), filtersOpen && /* @__PURE__ */ React.createElement("div", { className: "dl-filter-panel ws-filter-panel" }, /* @__PURE__ */ React.createElement("div", { className: "dl-filter-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", null, "Document Type"), /* @__PURE__ */ React.createElement("div", { className: "ws-doc-type-grid" }, DOCUMENT_TYPES.map((type) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: type,
        type: "button",
        className: "ds-fchip",
        "data-active": docTypes.includes(type) ? "true" : "false",
        onClick: () => {
          setDocTypes((current) => {
            const next = current.includes(type) ? current.filter((entry) => entry !== type) : [...current, type];
            return next.length ? next : DOCUMENT_TYPES;
          });
        }
      },
      docTypes.includes(type) && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 11 }),
      type
    )))), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-field" }, /* @__PURE__ */ React.createElement("label", null, "Stage"), /* @__PURE__ */ React.createElement("select", { value: stage, onChange: (event) => setStage(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Stages"), STAGES.map((entry) => /* @__PURE__ */ React.createElement("option", { key: entry, value: entry }, entry)))), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-field" }, /* @__PURE__ */ React.createElement("label", null, "Validation"), /* @__PURE__ */ React.createElement("select", { value: validation, onChange: (event) => setValidation(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Validation"), VALIDATIONS.map((entry) => /* @__PURE__ */ React.createElement("option", { key: entry, value: entry }, entry)))), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", null, "Assignee"), /* @__PURE__ */ React.createElement("select", { value: assignee, onChange: (event) => setAssignee(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Assignees"), /* @__PURE__ */ React.createElement("option", { value: "unassigned" }, "Unassigned"), USERS.map((user) => /* @__PURE__ */ React.createElement("option", { key: user.name, value: user.name }, user.name)))), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", onClick: resetFilters }, "Clear all"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", onClick: () => setFiltersOpen(false) }, "Apply")))), /* @__PURE__ */ React.createElement("div", { className: "dl-filter-shell" }, /* @__PURE__ */ React.createElement(
      Btn,
      {
        variant: "secondary",
        size: "sm",
        leadingIcon: "sort",
        trailingIcon: sortOpen ? "chevron_up" : "chevron_down",
        onClick: () => setSortOpen((open) => !open)
      },
      "Sort"
    ), sortOpen && /* @__PURE__ */ React.createElement("div", { className: "dl-row-menu ws-sort-menu" }, [
      ["station", "Station"],
      ["documentType", "Document Type"],
      ["version", "Version"],
      ["stage", "Stage"],
      ["issues", "Issues"],
      ["validation", "Validation"],
      ["assignedTo", "Assigned To"]
    ].map(([key, label]) => /* @__PURE__ */ React.createElement("button", { key, "data-active": sort.key === key ? "true" : void 0, onClick: () => setSort((current) => ({ ...current, key })) }, sort.key === key && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13 }), label)), /* @__PURE__ */ React.createElement("button", { onClick: () => setSort((current) => ({ ...current, dir: current.dir === "asc" ? "desc" : "asc" })) }, /* @__PURE__ */ React.createElement(Icon, { name: sort.dir === "asc" ? "arrow_up" : "arrow_down", size: 13 }), sort.dir === "asc" ? "Ascending" : "Descending"))), /* @__PURE__ */ React.createElement("div", { className: "dl-vdivider" }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "refresh", onClick: () => showToast("Workspace refreshed") }, "Refresh")), /* @__PURE__ */ React.createElement("div", { className: "dl-chips" }, activeFilterChips.length ? activeFilterChips.map((chip) => /* @__PURE__ */ React.createElement("button", { key: chip.key, className: "ds-fchip", "data-active": "true", onClick: () => removeFilterChip(chip.key) }, /* @__PURE__ */ React.createElement("span", null, chip.label), /* @__PURE__ */ React.createElement("span", { className: "ds-fchip-x" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 10 })))) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-500)" } }, "Filters available: document type, stage, validation, assignee"), /* @__PURE__ */ React.createElement("button", { className: "ds-fchip", style: { borderStyle: "dashed", color: "var(--ink-500)" }, onClick: () => setFiltersOpen(true) }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 12 }), " Add filter"))), /* @__PURE__ */ React.createElement("div", { className: "dl-table-area ws-table-area" }, /* @__PURE__ */ React.createElement("div", { className: "dl-table-container" }, /* @__PURE__ */ React.createElement("table", { className: "ds-table ws-table", style: { width: "100%" } }, /* @__PURE__ */ React.createElement("colgroup", null, /* @__PURE__ */ React.createElement("col", { style: { width: 150 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 92 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 104 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 170 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 80 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 128 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 146 } }), /* @__PURE__ */ React.createElement("col", { style: { width: 126 } })), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement(SortTh, { sortKey: "station", sort, onSort: handleSort }, "Station"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "documentType", sort, onSort: handleSort }, "Document"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "version", sort, onSort: handleSort }, "Version"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "stage", sort, onSort: handleSort }, "Stage"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "issues", sort, onSort: handleSort }, "Issues"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "validation", sort, onSort: handleSort }, "Validation"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "assignedTo", sort, onSort: handleSort }, "Assigned To"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right" } }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, pagedItems.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "8", style: { padding: 0, border: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 28px" } }, /* @__PURE__ */ React.createElement(WorkspaceEmptyState, { onClear: resetFilters })))) : pagedItems.map((item) => /* @__PURE__ */ React.createElement(React.Fragment, { key: item.id }, /* @__PURE__ */ React.createElement(
      "tr",
      {
        "data-selected": expanded === item.id ? "true" : void 0,
        onDoubleClick: () => setExpanded((current) => current === item.id ? null : item.id)
      },
      /* @__PURE__ */ React.createElement("td", { onClick: () => setExpanded((current) => current === item.id ? null : item.id) }, /* @__PURE__ */ React.createElement("div", { className: "dl-station-cell", title: item.station }, item.station), /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, item.stationCode)),
      /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(TypePill, { type: item.documentType })),
      /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-version" }, item.version)),
      /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StageChip, { stage: item.stage })),
      /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-issues", "data-active": item.issues > 0 ? "true" : void 0 }, /* @__PURE__ */ React.createElement(Icon, { name: "info", size: 14 }), item.issues)),
      /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(ValidationChip, { validation: item.validation })),
      /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(AssigneeCell, { user: item.assignedTo })),
      /* @__PURE__ */ React.createElement("td", { className: "dl-action-table-cell", onClick: (event) => event.stopPropagation() }, /* @__PURE__ */ React.createElement(
        RowActions,
        {
          item,
          onOpen: (row) => showToast(`Opening ${row.stationCode} ${row.documentType}`),
          onAssign: setAssignItem,
          onToast: showToast
        }
      ))
    ), expanded === item.id && /* @__PURE__ */ React.createElement(DetailRow, { item }))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-foot" }, /* @__PURE__ */ React.createElement("div", { className: "dl-table-foot-left" }, /* @__PURE__ */ React.createElement("span", null, "Showing ", filteredItems.length ? pageStart + 1 : 0, "-", pageEnd, " of ", filteredItems.length, " visible documents", activeFilterChips.length > 0 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-500)" } }, " - ", activeFilterChips.length, " filter", activeFilterChips.length !== 1 ? "s" : "", " active")), /* @__PURE__ */ React.createElement("label", { className: "dl-page-size" }, /* @__PURE__ */ React.createElement("span", null, "Rows per page"), /* @__PURE__ */ React.createElement("select", { value: pageSize, onChange: (event) => setPageSize(Number(event.target.value)) }, [10, 25, 50].map((size) => /* @__PURE__ */ React.createElement("option", { key: size, value: size }, size))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-pager" }, /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === 1, onClick: () => setCurrentPage((page) => Math.max(1, page - 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 14 })), pageNumbers.map((pageNumber) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: pageNumber,
        className: "ds-page-btn",
        "data-current": pageNumber === safeCurrentPage ? "true" : void 0,
        onClick: () => setCurrentPage(pageNumber)
      },
      pageNumber
    )), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === totalPages, onClick: () => setCurrentPage((page) => Math.min(totalPages, page + 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 14 })))))), assignItem && /* @__PURE__ */ React.createElement(AssignModal, { item: assignItem, onClose: () => setAssignItem(null), onSave: saveAssignment }), toast && /* @__PURE__ */ React.createElement("div", { className: "dl-toast", role: "status", "aria-live": "polite" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 16 }), toast));
  };
  const wsCSS = `
.ws-content .dl-page-header {
  box-shadow: 0 3px 0 var(--accent), 0 4px 20px rgba(14,27,44,.07);
}

.ws-active-docs {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  box-shadow: var(--shadow-sm);
  color: var(--ink-700);
}
.ws-active-docs strong {
  color: var(--ink-900);
  font-size: 16px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.ws-active-docs span {
  color: var(--ink-500);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.ws-scope-bar {
  flex-wrap: wrap;
  align-items: center;
}
.ws-queue-tabs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ws-queue-count {
  min-width: 20px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  padding: 0 6px;
  border-radius: var(--r-full);
  background: var(--ink-100);
  color: var(--ink-600);
  font-size: 10.5px;
  font-weight: 800;
}
.dl-bulk-row-tab[data-active="true"] .ws-queue-count {
  background: var(--accent);
  color: var(--paper);
}

.ws-filter-panel .dl-filter-field[data-span="full"] {
  grid-column: 1 / -1;
}
.ws-doc-type-grid {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ws-doc-type-grid .ds-fchip {
  min-height: 30px;
}
.ws-sort-menu {
  min-width: 172px;
  right: 0;
  top: calc(100% + 6px);
}
.ws-sort-menu button[data-active="true"] {
  background: var(--accent-soft);
  color: var(--accent-text);
  font-weight: 800;
}

.ws-table {
  min-width: 1080px;
}
.ws-version {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-800);
}
.ws-type-pill {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 7px;
  border-radius: var(--r-xs);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.03em;
  border: var(--hairline);
}
.ws-type-pill[data-type="ESP"] {
  background: var(--accent-soft);
  color: var(--accent-text);
  border-color: color-mix(in srgb, var(--accent) 18%, var(--ink-200));
}
.ws-type-pill[data-type="SIP"] {
  background: var(--info-soft);
  color: var(--info-text);
  border-color: oklch(0.9 0.06 240);
}
.ws-type-pill[data-type="LOP"] {
  background: var(--warning-soft);
  color: var(--warning-text);
  border-color: oklch(0.9 0.08 80);
}
.ws-issues {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-500);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
}
.ws-issues[data-active="true"] {
  color: var(--danger-text);
}
.ws-assignee {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--ink-800);
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
}
.ws-avatar {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: var(--r-full);
  color: var(--paper);
  font-size: 9.5px;
  font-weight: 800;
}
.ws-avatar-empty {
  background: var(--ink-100);
  color: var(--ink-500);
}
.ws-detail-row td {
  padding: 0 14px 12px !important;
  background: color-mix(in srgb, var(--accent-soft) 18%, var(--paper));
}
.ws-detail-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.ws-detail-item {
  min-height: 58px;
  display: grid;
  align-content: center;
  gap: 3px;
  padding: 10px 12px;
  border-right: var(--hairline);
}
.ws-detail-item:nth-child(4n) { border-right: 0; }
.ws-detail-item span {
  color: var(--ink-500);
  font-size: 10.5px;
  font-weight: 700;
}
.ws-detail-item strong {
  color: var(--ink-800);
  font-size: 11.5px;
  line-height: 1.35;
  word-break: break-word;
}
.ws-modal-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-bottom: var(--hairline);
  background: var(--ink-50);
  flex-wrap: wrap;
}
.ws-assign-body {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.ws-assign-body textarea {
  min-height: 92px;
}

@media (max-width: 1120px) {
  .ws-detail-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); }
  .ws-detail-item:nth-child(4n) { border-right: var(--hairline); }
  .ws-detail-item:nth-child(2n) { border-right: 0; }
}
@media (max-width: 760px) {
  .ws-active-docs { width: 100%; justify-content: flex-start; }
  .ws-scope-bar { align-items: flex-start; }
  .ws-detail-grid,
  .ws-assign-body { grid-template-columns: 1fr; }
  .ws-detail-item,
  .ws-detail-item:nth-child(2n),
  .ws-detail-item:nth-child(4n) { border-right: 0; }
}
`;
  window.WorkspacePage = WorkspacePage;
  const wsStyleEl = document.createElement("style");
  wsStyleEl.textContent = wsCSS;
  document.head.appendChild(wsStyleEl);
})();
