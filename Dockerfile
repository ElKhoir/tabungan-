app = "tabungan-santri-alhidayah"   # ganti jika app name di Fly beda
primary_region = "sin"

[build]

[env]
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

  [[http_service.checks]]
    interval = "15s"
    timeout = "3s"
    method = "GET"
    path = "/health"
    grace_period = "10s"
