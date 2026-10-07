defmodule Server do
  @port 4000
  @root "."

  def start do
    {:ok, socket} =
      :gen_tcp.listen(@port, [
        :binary,
        active: false,
        reuseaddr: true
      ])

    IO.puts("Server: http://localhost:#{@port}")

    accept(socket)
  end

  defp accept(socket) do
    {:ok, client} = :gen_tcp.accept(socket)

    spawn(fn ->
      handle_client(client)
    end)

    accept(socket)
  end

  defp handle_client(client) do
    case :gen_tcp.recv(client, 0) do
      {:ok, request} ->
        response = handle_request(request)
        :gen_tcp.send(client, response)

      {:error, reason} ->
        IO.inspect(reason, label: "Request error")
    end

    :gen_tcp.close(client)
  end

  defp handle_request(request) do
    [request_line | _headers] =
      request
      |> String.split("\r\n")

    [method, path, _version] =
      String.split(request_line, " ")

    IO.puts("#{method} #{path}")

    case method do
      "GET" ->
        serve(path)

      _ ->
        response(
          405,
          "text/plain",
          "Method Not Allowed"
        )
    end
  end

  # --------------------------------
  # ROUTING
  # --------------------------------

  defp serve("/") do
    serve_file("index.html", "text/html")
  end

  # SPA routes
  defp serve("/about") do
    serve_file("index.html", "text/html")
  end

  defp serve("/contact") do
    serve_file("index.html", "text/html")
  end

  # CSS
  defp serve("/css/" <> file) do
    serve_file("css/" <> file, "text/css")
  end

  # JavaScript
  defp serve("/js/" <> file) do
    serve_file("js/" <> file, mime_type(file))
  end

  # API
  defp serve("/api/users") do
    json = ~s({"users":[{"id":1,"name":"Tokhir"}]})

    response(200, "application/json", json)
  end

  # Unknown SPA route
  defp serve(_path) do
    serve_file("index.html", "text/html")
  end

  # --------------------------------
  # FILE SERVER
  # --------------------------------

  defp serve_file(path, content_type) do
    full_path = Path.join(@root, path)

    case File.read(full_path) do
      {:ok, content} ->
        response(200, content_type, content)

      {:error, :enoent} ->
        response(
          404,
          "text/plain",
          "404 Not Found"
        )

      {:error, reason} ->
        IO.inspect(reason, label: "File error")

        response(
          500,
          "text/plain",
          "Internal Server Error"
        )
    end
  end

  # --------------------------------
  # MIME TYPES
  # --------------------------------

  defp mime_type(file) do
    case Path.extname(file) do
      ".js" ->
        "application/javascript"

      ".json" ->
        "application/json"

      ".css" ->
        "text/css"

      ".html" ->
        "text/html"

      ".svg" ->
        "image/svg+xml"

      ".png" ->
        "image/png"

      ".jpg" ->
        "image/jpeg"

      ".jpeg" ->
        "image/jpeg"

      ".webp" ->
        "image/webp"

      _ ->
        "application/octet-stream"
    end
  end

  # --------------------------------
  # HTTP RESPONSE
  # --------------------------------

  defp response(status, content_type, body) do
    status_text =
      case status do
        200 -> "OK"
        404 -> "Not Found"
        405 -> "Method Not Allowed"
        500 -> "Internal Server Error"
      end

    body = IO.iodata_to_binary(body)

    """
    HTTP/1.1 #{status} #{status_text}\r
    Content-Type: #{content_type}\r
    Content-Length: #{byte_size(body)}\r
    Connection: close\r
    \r
    #{body}
    """
  end
end

Server.start()
