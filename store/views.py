
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Product, Banner
from .serializers import ProductSerializer, BannerSerializer
from .auth_serializers import RegisterSerializer


# 1. Get all active products
@api_view(["GET"])
def product_list(request):
    products = Product.objects.filter(
        is_active=True
    ).select_related("category")

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request},
    )

    return Response(serializer.data)


# 2. Get featured products
@api_view(["GET"])
def featured_products(request):
    products = Product.objects.filter(
        is_active=True,
        is_featured=True,
    ).select_related("category")

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request},
    )

    return Response(serializer.data)


# 3. Get active homepage banners
@api_view(["GET"])
def banner_list(request):
    banners = Banner.objects.filter(is_active=True)

    serializer = BannerSerializer(
        banners,
        many=True,
        context={"request": request},
    )

    return Response(serializer.data)


# 4. Get details of one active product
@api_view(["GET"])
def product_detail(request, product_id):
    try:
        product = Product.objects.select_related("category").get(
            id=product_id,
            is_active=True,
        )
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ProductSerializer(
        product,
        context={"request": request},
    )

    return Response(serializer.data)


# 5. Register a new user
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Registration successful",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# 6. Log in an existing user
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")

    user = authenticate(
        request=request,
        username=username,
        password=password,
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Login successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        },
        status=status.HTTP_200_OK,
    )


# 7. Log out the current user
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
    request.auth.delete()

    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK,
    )


# 8. Get the currently logged-in user's profile
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
        },
        status=status.HTTP_200_OK,
    )
