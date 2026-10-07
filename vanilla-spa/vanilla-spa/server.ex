defmodule Server do
  @port 4000

  def start do
    {:ok, socket} =
      :gen_tcp.listen(
        @port,
        [
          :binary,
          active: false,
          reuseaddr: true
        ]
      )

    IO.puts("Server running at http://localhost:#{@port}")

    accept(socket)
  end

  defp accept(socket) do
    {:ok, client} = :gen_tcp.accept(socket)

    spawn(fn ->
      handle(client)
    end)

    accept(socket)
  end

  defp handle(client) do
    {:ok, request} = :gen_tcp.recv(client, 0)

    IO.puts(request)

    response = """
    HTTP/1.1 200 OK\r
    Content-Type: text/plain\r
    Content-Length: 12\r
    Connection: close\r
    \r
    Hello Elixir
    """

    :gen_tcp.send(client, response)
    :gen_tcp.close(client)
  end
end

Server.start()