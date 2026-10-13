
from django.urls import path
from . import views

urlpatterns = [
    # Product APIs
    path("api/products/", views.product_list, name="product-list"),
    path(
        "api/products/featured/",
        views.featured_products,
        name="featured-products",
    ),
    path(
        "api/products/<int:product_id>/",
        views.product_detail,
        name="product-detail",
    ),

    # Banner API
    path("api/banners/", views.banner_list, name="banner-list"),

    # Authentication APIs
    path("api/auth/register/", views.register_user, name="register"),
    path("api/auth/login/", views.login_user, name="login"),
    path("api/auth/logout/", views.logout_user, name="logout"),
    path("api/auth/me/", views.current_user, name="current-user"),
]
