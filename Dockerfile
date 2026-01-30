# Multi-stage Dockerfile for .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy backend project
COPY backend/FreightERP.API/*.csproj ./backend/FreightERP.API/
WORKDIR /app/backend/FreightERP.API
RUN dotnet restore

# Copy everything else and build
WORKDIR /app
COPY backend/FreightERP.API/. ./backend/FreightERP.API/
WORKDIR /app/backend/FreightERP.API
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/backend/FreightERP.API/out .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "FreightERP.API.dll"]
