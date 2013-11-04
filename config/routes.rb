SharePla::Application.routes.draw do
  root 'top#index'

  match '/plan/new',          to: 'plan#index',        via: 'get'
  match '/plan/add',          to: 'plan#add',          via: 'post'
  match '/plan/save',         to: 'plan#save',         via: 'post'
  match '/plan/search/hotel', to: 'plan#search_hotel', via: 'post'
  match '/plan/show/:id',     to: 'top#show',          via: 'get',  as: :plan
  match '/plan/clone',        to: 'plan#clone',        via: 'post', as: :plan_clone

  match '/pdf/sample', to: 'documents#sample', via: 'get'
  match '/pdf/string', to: 'documents#string', via: 'post'
  match '/static/',    to: 'top#static',       via: 'get'
  match '/pdf',        to: 'documents#create', via: 'post'

  #get "hello/to/:name" => "hello#to"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  #root 'newplan#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
