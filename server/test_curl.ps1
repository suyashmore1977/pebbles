$env:GEMINI_API_KEY = "AIzaSyCP_V721atmP84evtM0OGa5Fio9n69c_8g"
$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Hello" }
            )
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$env:GEMINI_API_KEY" -Method Post -Body $body -ContentType "application/json"
